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
			      value-format="yyyy-MM-dd">
			    </el-date-picker>
			</div>
			<el-select v-model="auditStatus" placeholder="审核状态" class="handle-select m-r-10">
                <el-option key="0" label="全部" value=" " ></el-option>
                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in auditStatusList"></el-option>
            </el-select>
	        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border class="table"  tooltip-effect="light" stripe ref="multipleTable" >
            <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
            <!--<el-table-column prop="courseId" label="序号" width="50">
            </el-table-column>-->
            <el-table-column prop="contentName" label="体系名称" >
            </el-table-column>
            <el-table-column prop="knowledgeName" label="知识元名称" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" width="80">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="120">
            </el-table-column>
            <el-table-column prop="auditor" label="审核人" width="80">
            </el-table-column>
            <el-table-column prop="auditStatusName" label="审核状态" width="80">
            </el-table-column>
            <el-table-column prop="remarks" label="备注" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(data[scope.$index].id)">查看</el-button>
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(data[scope.$index].id)">编辑</el-button>
                    <el-button type="text" class="red"  icon="el-icon-delete" @click="">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-count="total" layout="prev, pager, next" >
            </el-pagination>
        </div>
        
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="120px">
            	<el-row :gutter="20">
            		<el-col :span="12">
		                <el-form-item label="知识元名称">
		                    <el-input v-model="form.name"></el-input>
		                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="体系类型">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
    import bus from '../../../common/bus';
	export default{
		name: "systemTable",
		data() {
            return {
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                contentName: '',
                date: '',
                auditStatusList: [],
                auditStatus: '',
                form: {
                    name: '',
                    address: ''
                },
                idx: -1,
                elId:null,
                elParentId:null,
                materialId:null,
                fasciclesId:null,
                total: 1
            }
        },
        mounted() {
        	bus.$on('elParam', (data) => {
	        	// console.log(data)
	        	this.elId = data.id;
	        	this.elParentId = data.parentId;
	        	this.materialId = data.materialId;
		        this.fasciclesId = data.fasciclesId;
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
						// console.log(this.auditStatusList)
					}
				})
         	}
//	      	this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.contentName === this.del_list[i].contentName) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.category.indexOf(this.select_cate) > -1 &&
                            (d.contentName.indexOf(this.select_word) > -1 ||
                                d.category.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            },
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
            // 获取 easy-mock 的模拟数据
            getData() {
            	if(this.elParentId == null){
            		this.tableData = [];
            		return;
            	}
                this.$axios.get("app/architectureTree/list",{
                    params:{
		    			"courseId": this.elId, // 学科ID
		    			"parentId": this.elParentId, // 父节点ID，顶级父节点传0
		    			"materialId": this.materialId,
		    			"fasciclesId": this.fasciclesId,
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
	                	// console.log(this.total)
	                    this.tableData = res.data.data.rows;
	                }
                })
            },
            search() {
            	this.cur_page = 1;
                this.getData();
            },
            handleEdit(id,courseId,parentId) {
            	this.$router.push('/systemUpdate?id='+id);
            },
            handleCheck(id,courseId,parentId) {
            	console.log(id);
                this.$router.push('/systemDetails?id='+id);
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        },
       	watch:{
	        elParentId(val, oldVal){//普通的watch监听
	            // console.log("a: "+val, oldVal);
	            this.getData();
	        }
	    }
	}
</script>

<style>
	
</style>