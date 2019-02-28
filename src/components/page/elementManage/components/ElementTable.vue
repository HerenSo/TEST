<template>
	<div class="container">
		<div class="handle-box">
			<!--<div class="demo-input-suffix">
				学科：
				<el-input v-model="select_word" placeholder="" clearable class="handle-input-sm m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				科类：
				<el-input v-model="select_word" placeholder="" clearable class="handle-input-sm m-r-10"></el-input>
			</div>-->
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
                <el-option key="0" label="全部" value="全部" ></el-option>
                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in auditStatusList"></el-option>
            </el-select>
			<el-select v-model="shelfStatus" placeholder="上架状态" class="handle-select m-r-10">
                <el-option key="0" label="全部" value="全部" ></el-option>
                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in shelfStatusList"></el-option>
            </el-select>
	        <el-button type="primary" icon="search" @click="search" class="m-r-10">搜索</el-button>
	        <el-button type="primary" icon="search" @click="add">新增</el-button>
        </div>
        <el-table :data="data" border class="table" stripe ref="multipleTable" @selection-change="handleSelectionChange">
            <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
            <el-table-column prop="id" label="序号" width="50"><!--sortable--> 
            </el-table-column>
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
            <el-table-column fixed="right" label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(data[scope.$index].id)">查看</el-button>
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(data[scope.$index].id,data[scope.$index].courseId,data[scope.$index].parentId)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-count="total" layout="prev, pager, next">
            </el-pagination>
        </div>
        
        <!-- 编辑弹出框 -->
        <!--<el-dialog title="编辑" :visible.sync="editVisible" width="40%">
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
            		<el-col :span="12">
	                <el-form-item label="学科">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="科类">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="审核状态">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="上架状态">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="创建人">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="创建日期">
	                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="审核人">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>
            		<el-col :span="12">
	                <el-form-item label="审核日期">
	                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
	                </el-form-item>
	                </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
	-->
	</div>
</template>

<script>
    import bus from '../../../common/bus';
	export default{
		name: "systemTable",
		data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                name: '',
                date: '',
                auditStatusList: [],
                shelfStatusList: [],
                auditStatus: '',
                shelfStatus: '',
                form: {
                    name: '',
                    address: ''
                },
                elId:null,
                elParentId:null,
                studyCourses:null,
                idx: -1,
                total: 1
            }
        },
        mounted() {
         	bus.$on('elParam', (data) => {
	        	console.log(data)
	        	this.elId = data.id;
	        	this.elParentId = data.parentId;
	        	this.studyCourses = data.studyCourses;
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
//          this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.category.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
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
            // 获取 list数据
            getData() {
            	console.log(this.elParentId)
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
	                    this.tableData = res.data.data.rows;
	                }
                })
//              .catch(error => {
//		          	this.$message({
//			          message: error,
//			          type: 'warning'
//			        });
//		        });
            },
            search() {
            	this.cur_page = 1;
                this.getData();
            },
            add() {
            	this.$router.push({
	                path:'/elementAdd',
	                name: 'elementAdd',
	                query: { 
                    	"parentId": this.elParentId, // 父节点ID，顶级父节点传0
	    				"courseId": this.elId,
	    				"courseName": this.studyCourses
	                }
	            })
            },
            handleEdit(id,courseId,parentId) {
            	this.$router.push('/elementUpdate?id='+id);
            },
            handleCheck(id,courseId,parentId) {
            	console.log(id);
                this.$router.push('/elementDetails?id='+id);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
       	},
       	watch:{
	        elParentId(val, oldVal){//普通的watch监听
//	            console.log("a: "+val, oldVal);
	            this.cur_page = 1;
	            this.getData();
	        }
	    }
	}
</script>

<style>
	
</style>