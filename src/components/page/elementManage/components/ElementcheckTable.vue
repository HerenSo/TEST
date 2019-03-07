<template>
	<div class="container">
		<div class="handle-box">
			<div class="demo-input-suffix">
				知识元名称：
				<el-input v-model="name" placeholder="" clearable class="handle-input-md m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				<el-date-picker
				  class="data_range m-r-10"
			      v-model="date"
			      type="daterange"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      value-format="yyyy-MM-dd">
			    </el-date-picker>
			</div>
			<el-select v-model="auditStatus" placeholder="审核状态" class="handle-select m-r-10">
                <el-option key="0" label="全部" value="" ></el-option>
                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in auditStatusList"></el-option>
            </el-select>
			<el-select v-model="shelfStatus" placeholder="上架状态" class="handle-select m-r-10">
                <el-option key="0" label="全部" value="" ></el-option>
                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in shelfStatusList"></el-option>
            </el-select>
	        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <!--table-data-->
        <el-table :data="data" border class="table" stripe ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="courseName" label="学科" >
            </el-table-column>
            <el-table-column prop="category" label="科类" >
            </el-table-column>
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="creator" label="创建人" >
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180">
            </el-table-column>
            <el-table-column prop="auditStatusName" label="审核状态" >
            </el-table-column>
            <el-table-column prop="shelfStatusName" label="上架状态" >
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="190" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(data[scope.$index].id,1)">查看</el-button>
                    <el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="data[scope.$index].auditStatus == 5 || data[scope.$index].auditStatus == 15" @click="handleCheck(data[scope.$index].id,2)">审核</el-button>
                    <el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="data[scope.$index].auditStatus == 10" @click="handleCheck(data[scope.$index].id,2)">反审核</el-button>
                    <el-button type="text" class="text-color-success" icon="el-icon-lx-tag" v-if="data[scope.$index].shelfStatus == 5" @click="handleCheck(data[scope.$index].id,3)">上架</el-button>
                    <el-button type="text" class="text-color-success" icon="el-icon-lx-tag" v-if="data[scope.$index].shelfStatus == 10" @click="handleCheck(data[scope.$index].id,3)">下架</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-count="total" layout="prev, pager, next">
            </el-pagination>
        </div>
        <!--table-data END-->
	</div>
</template>

<script>
    import bus from '../../../common/bus';
	export default{
		name: "elementcheckTable",
		data() {
            return {
                data: [], // table数据
                cur_page: 1, // 当前分页
                multipleSelection: [], // 点击当前tr
                name: '', // 知识元名称检索
                date: '', // 日期检索
                auditStatusList: [], // 审核状态列表
                shelfStatusList: [], // 上架状态列表
                auditStatus: '', // 审核状态检索
                shelfStatus: '', // 上架状态检索
                elId:null, // 知识元树传给table的ID
                elParentId:null, // 知识元树传给table的父级ID
                studyCourses:null, // 学段与学科名称拼接
                total: 1 // 分页数
            }
       },
        mounted() {
         	bus.$on('elParam', (data) => { // 监听elementTable组件传过来的值
	        	this.elId = data.id;
	        	this.elParentId = data.parentId;
	        	this.studyCourses = data.studyCourses;
	        	this.cur_page = 1;
	            this.getData();
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
         	
         	// 获取上架状态数据
         	if(localStorage.getItem("shelfStatus")){
         		this.shelfStatusList = JSON.parse(localStorage.getItem("shelfStatus"));
         	}else{
         		this.$axios.get("app/combobox/shelfStatus/list").then((res) => {
					if(res.status=="200" && res.data.code == '0000'){
						this.shelfStatusList = res.data.data;
						localStorage.setItem("shelfStatus",JSON.stringify(this.shelfStatusList));
					}
				})
         	}
        },
        computed: {
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
            // 获取table数据
            getData() {
            	if(this.elParentId == null){
            		this.tableData = [];
            		return;
            	}
                this.$axios.get("app/knowledgeTree/list",{
                    params:{
		    			"courseId": this.elId, // 学科ID
		    			"parentId": this.elParentId, // 父节点ID，顶级父节点传0
		    			"beginTime": this.beginTime, // 开始日期，没有则传空字符串或不传
		    			"endTime": this.endTime, // 结束日期，没有则传空字符串或不传
		    			"name": this.name, // 知识元名称，没有则传空字符串或不传
		    			"category": "", // 学科类型，没有则传空字符串或不传
		    			"auditStatus": this.auditStatus, // 审核状态，没有则传空字符串或不传
		    			"shelfStatus": this.shelfStatus, // 上架状态，没有则传空字符串或不传
		    			"rows": 10, // 每页记录数，默认为25
						"page": this.cur_page // 当前页码
		    		}
                }).then((res) => {
                    if(res.status == 200 && res.data.code == '0000'){
	                	this.total = res.data.data.total;
//	                	console.log(this.total)
	                    this.data = res.data.data.rows;
	                }
                })
            },
            search() { // 搜索
            	this.cur_page = 1;
                this.getData();
            },
            handleCheck(id,type) { // 查看
                this.$router.push('/elementDetails?id='+id+'&type='+type);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
	}
</script>

<style>
	
</style>