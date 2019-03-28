<template>
	<div class="container">
		<div class="handle-box">
			<div class="demo-input-suffix">
				体系名称：
				<el-input v-model="contentName" placeholder="" clearable class="handle-input-sm m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				<el-date-picker
				  class="data_range m-r-10"
			      v-model="date"
			      type="daterange"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      value-format="yyyy-MM-dd"
			      @change="search">
			    </el-date-picker>
			</div>
			<div class="demo-input-suffix">
				审核状态：
				<el-select v-model="auditStatus" placeholder="审核状态" class="handle-select m-r-10" @change="search">
	                <el-option key="0" label="全部" value="" ></el-option>
	                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in auditStatusList"></el-option>
	            </el-select>
           </div>
	        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <!--table-data-->
        <el-table :data="data" border class="table" tooltip-effect="light" stripe ref="multipleTable" @selection-change="">
            <el-table-column prop="contentName" label="体系名称" >
            </el-table-column>
            <el-table-column prop="courseName" label="学科" width="120">
            </el-table-column>
            <el-table-column prop="category" label="科类" width="120">
            </el-table-column>
            <el-table-column prop="gradeName" label="年级" width="80">
            </el-table-column>
            <el-table-column prop="owner" label="归属人" width="80">
            </el-table-column>
            <el-table-column prop="creator" label="创建人" width="80">
            </el-table-column>
            <el-table-column prop="auditor" label="审核人" width="80">
            </el-table-column>
            <el-table-column prop="auditStatusName" label="审核状态" width="80">
            </el-table-column>
            <el-table-column prop="remarks" label="备注" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(data[scope.$index].id,1)" v-if="right_view">查看</el-button>
                    <el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="(data[scope.$index].auditStatus == 5 || data[scope.$index].auditStatus == 15) && right_update" @click="handleCheck(data[scope.$index].id,2)">审核</el-button>
                    <el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="data[scope.$index].auditStatus == 10 && right_update" @click="handleCheck(data[scope.$index].id,2)">反审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-count="total" layout="prev, pager, next" >
            </el-pagination>
        </div>
        <!--table-data END-->
	</div>
</template>

<script>
    import bus from '../../../common/bus';
	export default{
		name: "systemtypeTable",
		data() {
            return {
                data: [],
                data: [], // table数据
                cur_page: 1, // 当前分页
                multipleSelection: [], // 点击当前tr
                del_list: [], // 当前点击的删除ID
                enable_list:[], // 当前点击的恢复ID
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false, // 控制恢复弹窗
                contentName: '', // 体系名称检索
                date: '', // 日期检索
                auditStatusList: [], // 审核状态列表
                auditStatus: '', // 审核状态检索
                elId:null, // 知识元树传给table的ID
                elParentId:null, // 知识元树传给table的父级ID
                materialId:null, // 知识元树传给table的教材ID
                fasciclesId:null, // 知识元树传给table的分册ID
                gradeId: null,
                courseName: null,
                studyCourses:null,
                selectedOptions: [],
                right_update: false, // 修改权限
                right_view: false, // 查看权限
                total: 1 // 分页数
            }
        },
        mounted() {
        	bus.$on('elParam', (data) => { // 监听systemTree组件传过来的值
	        	this.elId = data.id;
	        	this.elParentId = data.parentId;
	        	this.materialId = data.materialId;
		        this.fasciclesId = data.fascicleId;
//		       	this.gradeId = data.gradeId;
		       	this.courseName = data.courseName;
		       	this.selectedOptions = data.selectedOptions;
	      	})
        	
        	// 权限
         	let rights = JSON.parse(localStorage.getItem("ms_rights"));
         	let curRights = rights.filter(function(item){
         		return item.rightId.split(":")[0] == 'knowledgeAudit';
         	})
         	let that = this;
         	curRights.forEach(function(item){
         		switch(item.rightId.split(":")[1]){
         			case "update":that.right_update = true;
         			break;
         			case "view":that.right_view = true;
         			break;
         			default:break;
         		}
         	})
         	
        	// 获取审核状态数据
         	if(localStorage.getItem("auditStatus")){
         		this.auditStatusList = JSON.parse(localStorage.getItem("auditStatus"));
         	}else{
         		this.$axios.get("app/combobox/auditStatus/list").then((res) => {
					if(res.status=="200" && res.data.code == '0000'){
						this.auditStatusList = res.data.data;
						localStorage.setItem("auditStatus",JSON.stringify(this.auditStatusList));
					}
				})
         	}
        },
        computed: { // 计算开始和结束日期
            beginTime: function () {
            	return this.date[0];
		    },
            endTime: function () {
            	return this.date[1];
		    }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 table 数据
            getData() {
            	if(this.elParentId == null){
            		this.tableData = [];
            		return;
            	}
                this.$axios.get("app/architectureTree/list",{
                    params:{
		    			"courseId": this.elId, // 学科ID
		    			"parentId": this.elParentId, // 父节点ID，顶级父节点传0
		    			"materialId": this.materialId, //教材
		    			"fasciclesId": this.fasciclesId, // 分册
		    			"beginTime": this.beginTime, // 开始日期，没有则传空字符串或不传
		    			"endTime": this.endTime, // 结束日期，没有则传空字符串或不传
		    			"contentName": this.contentName, // 体系名称，没有则传空字符串或不传
		    			"category": "", // 学科类型，没有则传空字符串或不传
		    			"auditStatus": this.auditStatus, // 审核状态，没有则传空字符串或不传
		    			"rows": 10, // 每页记录数，默认为25
						"page": this.cur_page // 当前页码
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.total = res.data.data.total;
	                    this.data = res.data.data.rows;
	                }
                })
            },
            search() { // 搜索
            	this.cur_page = 1;
                this.getData();
            },
            add() { // 新增
            	if(!this.fasciclesId){
            		this.$message({
			          message: "请选择分册！",
			          type: 'error'
			        });
			        return;
            	}
           		console.log(this.fasciclesId)
            	this.$router.push({
	                path:'/systemAdd',
	                name: 'systemAdd',
	                query: { 
                    	"parentId": this.elParentId, // 父节点ID，顶级父节点传0
	    				"courseId": this.elId,
		        		"materialId": this.materialId,
		        		"fasciclesId": this.fasciclesId,
	    				"courseName": this.courseName,
	    				"selectedOptions": this.selectedOptions
	                }
	            })
            },
            handleCheck(id,type) { // 查看操作
                this.$router.push('/systemDetails?id='+id+'&type='+type);
            },
            handleEdit(id,courseId,parentId) { // 编辑操作
            	this.$router.push('/systemUpdate?id='+id);
            }
        },
       	watch:{
	        elParentId(val, oldVal){//普通的watch监听
                this.cur_page = 1;
	            this.getData();
	        },
	        elId(val, oldVal){ // 
                this.cur_page = 1;
	        	this.getData();
	        },
	        fasciclesId(val, oldVal){ // 
                this.cur_page = 1;
	        	this.getData();
	        }
	    }
	}
</script>

<style>
	
</style>