<template>
	<div class="">
		<el-row :gutter="20">
			<el-col :span="5" >
				<div class="container m-b-20">
					<!--学科-->
				   <el-cascader
				    expand-trigger="hover"
				    :options="coursesList"
				    v-model="selectedOptions"
				    :props="props"
				    @change="handleSelect">
					</el-cascader>
				</div>
				<div class="container">
					<div class="el-dropdown-link text-color-blue m-b-20">
				    教材<i class="el-icon-arrow-down el-icon--right"></i>
				</div>
					  <!--:default-expanded-keys="treeExpandedKeys"
					  @node-expand="treeExpand"-->
					<el-tree
					  ref="tree"
					  :data="material"
					  :props="defaultProps"
			  		  :current-node-key='currentKey'
					  highlight-current
					  auto-expand-parent
					  node-key="id"
					  expand-on-click-node
					  accordion
					  @node-click="handleNodeClick">
					</el-tree>
				</div>					
			</el-col>
			<el-col :span="19" >
				<div class="container">
					<div class="handle-box">
						<div class="demo-input-suffix">
							分册名称：
							<el-input v-model="fascicleName" placeholder="" clearable class="handle-input-md m-r-10"></el-input>
						</div>
						<div class="demo-input-suffix">
							数据状态：
							<el-select v-model="dataStatus" placeholder="数据状态" class="handle-select m-r-10" @change="search">
				                <el-option key="1" label="启用" value="1" ></el-option>
				                <el-option key="0" label="停用" value="0" ></el-option>
				            </el-select>
						</div>
				        <el-button type="primary" icon="search" @click="search" class="m-r-10">搜索</el-button>
				        <el-button type="primary" icon="search" @click="handleChange('add')"  v-if="right_add">新增</el-button>
			        </div>
			        
			        <!-- table-data -->
			        <el-table :data="data" border class="table" stripe ref="multipleTable" >
			            <el-table-column prop="id" label="角色id" align="center" width="260">
			            </el-table-column>
			            <el-table-column prop="fascicleName" label="分册名称"  align="center">
			            </el-table-column>
			            <el-table-column prop="materialName" label="教材名称"  align="center">
			            </el-table-column>
			            <el-table-column prop="courseName" label="学科名称"  align="center">
			            </el-table-column>
			            <el-table-column prop="periodName" label="学段名称"  align="center">
			            </el-table-column>
			            <el-table-column prop="dataStatusName" label="数据状态"  align="center">
			            </el-table-column>
			            <el-table-column fixed="right" label="操作" width="180" align="center">
			                <template slot-scope="scope">
			                    <el-button type="text" icon="el-icon-edit" @click="handleChange(data[scope.$index].id)" v-if="right_update">编辑</el-button>
			                    <el-button type="text" class="red" v-if="data[scope.$index].dataStatus == 1 && right_delete" icon="el-icon-delete" @click="handleDelete(data[scope.$index].id)">删除</el-button>
			                    <el-button type="text" class="red" v-if="data[scope.$index].dataStatus == 0 && right_delete" icon="el-icon-refresh" @click="handleEnable(data[scope.$index].id)">恢复</el-button>
			                </template>
			            </el-table-column>
			        </el-table>
			        <div class="pagination">
			            <el-pagination background @current-change="handleCurrentChange" :page-count="total" layout="prev, pager, next">
			            </el-pagination>
			        </div>
			        <!--table-data END-->
		        </div>
	        </el-col>
        </el-row>
        <!-- 新增编辑 -->
        <el-dialog :title="title" :visible.sync="visible" width="40%">
        	<el-row :gutter="20">
        		<el-col :span="22">
					<el-form ref="form" :model="form" label-width="80px">
						<el-form-item label="学科:">
							<el-cascader
						    expand-trigger="hover"
						    :options="coursesList"
						    v-model="selectedOptions2"
						    :props="props"
						    @change="handleSelect2">
							</el-cascader>
					  	</el-form-item>
					  	<el-form-item label="教材:">
					  		<el-select v-model="materialName" placeholder="请选择教材" class="handle-select m-r-10" @change="selectMaterial">
				                 <el-option :key="item.id" :label="item.materialName" :value="item.id" v-for="item in material2"></el-option>
				            </el-select>
				        </el-form-item>
					  	<el-form-item label="分册名称:">
					    	<el-input v-model="form.fascicleName"></el-input>
					  	</el-form-item>
					  	<el-form-item label="排序:">
					    	<el-input v-model="form.seq"></el-input>
					  	</el-form-item>
					</el-form>  
				</el-col>
			</el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="sure" >确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 删除弹出框 -->
        <el-dialog title="删除" :visible.sync="delVisible" width="40%">
            	<el-row :gutter="20">
            		<el-col :span="12"> 确定删除吗？</el-col>
               </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureDel" >确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 恢复弹出框 -->
        <el-dialog title="恢复" :visible.sync="enableDelVisible" width="40%">
            	<el-row :gutter="20">
            		<el-col :span="12"> 确定恢复吗？</el-col>
               </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="enableDelVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureEnable" >确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
	export default{
		name: "roleInfo",
		data() {
            return {
                data: [], // table数据
                cur_page: 1, // 当前分页
                coursesList: [], // 学科列表
		        material: [], // 教材列表
		        material2: [], // 教材列表
		        courseId: null, // 初始默认 学课ID
		        courseId2: null,
		        materialId: null, // 教材ID
		        materialName:'',
		        currentKey: null,
		        defaultProps: { // 知识元树数据配置
		          children: 'children',
		          label: 'materialName',
		          id:'id'
		        },
		        props:{ // 学科数据配置
		        	label:'studyPeriod',
		        	value: 'id',
            		children: 'courses'
		        },
		        selectedOptions:[], // 学段学科选择绑定的ID
		        selectedOptions2:[], // 学段学科选择绑定的ID
                del_list: [], // 当前点击的删除ID
                enable_list:[], // 当前点击的恢复ID
                form:{
                	fascicleName:'',
                	seq:''
                }, // 新增编辑表单
                visible: false, // 控制新增编辑弹窗
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false, // 控制恢复弹窗
		    	dataStatus: '1', // 数据状态， 默认搜索启用
		    	fascicleName: '', // 分册名称
		    	title:'', // 弹框标题
                right_add: false, // 新增权限
                right_update: false, // 修改权限
                right_delete: false, // 删权限
                right_view: false, // 查看权限
                total: 1 // 分页数
            }
        },
        mounted() {
        	this.getCourse(); // 请求学科
//       	this.getData();

         	// 权限
         	let rights = JSON.parse(localStorage.getItem("ms_rights"));
         	let curRights = rights.filter(function(item){
         		return item.rightId.split(":")[0] == 'fascicle';
         	})
         	let that = this;
         	curRights.forEach(function(item){
         		switch(item.rightId.split(":")[1]){
         			case "add":that.right_add = true;
         			break;
         			case "update":that.right_update = true;
         			break;
         			case "delete":that.right_delete = true;
         			break;
         			case "view":that.right_view = true;
         			break;
         			default:break;
         		}
         	})
        },
        methods: {
        	handleSelect(value) { // 选学科
	    		this.selectedOptions = value;
	    		this.selectedOptions2 = value;
		        this.courseId = value[value.length-1];
	      		this.queryMaterial(); // 请求教材
		    },
        	handleSelect2(value) { // 新增编辑部分 选学科
        		this.courseId2 = value[value.length-1];
	      		this.queryMaterial2(); // 请求教材
		    },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            handleNodeClick(data) { // 树点击
            	console.log(data)
	      		this.materialId = data.id;
	      		this.form.materialId = data.id;
	      		this.materialName = data.materialName;
	      		this.getData();
	      	},
	      	selectMaterial(val) {
	      		this.form.materialId = val;
	      	},
            search() { // 搜索
            	this.cur_page = 1;
                this.getData();
            },
            getCourse(){
            	// 请求学科
				this.$axios.get('app/study/period/tree',{
		    		params:{
		    			"haveCourse": "1",
		    			"haveGrade": "0"
		    		}
				}).then(res => {
		          	if(res.status == 200 && res.data.code == '0000'){
			          	this.coursesList = res.data.data;
			          	for(var i=0; i < this.coursesList.length; i++){
			          		for(var j=0; j < this.coursesList[i].courses.length;j++){
			          			this.coursesList[i].courses[j].studyPeriod = this.coursesList[i].courses[j].courseName;
			          		}
			          	}
			          	this.courseId = this.coursesList[0].courses[0].id;
		          		this.selectedOptions = [this.coursesList[0].id,this.courseId];
		          		this.selectedOptions2 = [this.coursesList[0].id,this.courseId];
//       				this.getData();
						this.queryMaterial();
		          	}
		        });
            },
            queryMaterial() {
		     	// 教材
		     	this.$axios.get('app/study/course/material/tree',{
		    		params:{
		    			"courseId": this.courseId,
		    			"haveFascicle": "1"
		    		}
				}).then(res => {
					if(res.status == 200 && res.data.code == '0000'){
			          	this.material = res.data.data;
			          	this.material2 = res.data.data;
			          	if(this.material.length > 0){
				        	this.materialId = this.material[0].id;
				        	this.form.materialId = this.material[0].id;
				        	this.materialName = this.material[0].materialName;
				        	this.getData(); // 请求树
			          	}else{
			          		this.materialId = '';
			          		this.materialName = '';
			          		this.form.materialId = '';
			          		this.data = [];
			          	}
				    	
			    	}
		        });
	     	},
            queryMaterial2() {
		     	// 新增部分 请求教材
		     	this.$axios.get('app/study/course/material/tree',{
		    		params:{
		    			"courseId": this.courseId2,
		    			"haveFascicle": "1"
		    		}
				}).then(res => {
					if(res.status == 200 && res.data.code == '0000'){
			          	this.material2 = res.data.data;
			          	if(this.material2.length > 0){
				        	this.form.materialId = this.material2[0].id;
				        	this.materialName = this.material2[0].materialName;
			          	}else{
			          		this.form.materialId = '';
			          		this.materialName = '';
			          	}
			    	}
		        });
	     	},
            // 获取 list数据
            getData() {
            	if(this.materialId == ''){
            		this.data = [];
            		return;
            	}
                this.$axios.get("app/study/course/material/fascicle/list",{
                    params:{
		    			"dataStatus": this.dataStatus, // 数据状态
		    			"fascicleName": this.fascicleName, // 分册名称
		    			"materialId": this.materialId, // 教材ID
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
            getDetails() { // 获取详情
            	this.$axios.get("app/study/course/material/fascicle/get",{
                    params:{
		    			"id": this.form.id // ID
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.visible = true;
	                	this.form.id = res.data.data.id;
	                	this.form.materialId = res.data.data.materialId;
	                	this.form.fascicleName = res.data.data.fascicleName;
//	                	this.materialName = res.data.data.materialName;
	                	this.form.seq = res.data.data.seq;
	                }
                })
            },
            sure() { // 新增编辑确定
            	let _url = '';
            	if(!this.form.materialId){
            		this.$message.warning('教材不能为空！');
            		return;
            	}
            	if(this.form.id){
            		_url = "app/study/course/material/fascicle/update"; // 编辑
            	}else{
            		_url = "app/study/course/material/fascicle/add"; // 新增
            	}
            	this.$axios.post(_url,
                    this.form
                ).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.visible = false;
	                	this.getData();
	                	this.$message.success(res.data.msg);
	                }
                })
            },
            sureDel() { // 确定删除
            	this.$axios.get("app/study/course/material/fascicle/disable",{
                    params:{
		    			"ids": this.del_list // ID
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.delVisible = false;
	                	this.getData();
	                	this.$message.success(res.data.msg);
	                }
                })
            },
            sureEnable() { // 确定恢复
            	this.$axios.get("app/study/course/material/fascicle/enable",{
                    params:{
		    			"ids": this.enable_list // ID
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.enableDelVisible = false;
	                	this.getData();
	                	this.$message.success(res.data.msg);
	                }
                })
            },
            handleChange(val) { // 新增编辑操作
				if(val == 'add'){ // 如果ID值存在跳编辑
					this.visible = true;
					this.title = '新增';
				}else{
					this.form.id = val;
					this.title = '编辑';
					this.getDetails(); // 获取详情
				}
            },
            handleDelete(val) { // 删除操作
				this.delVisible = true;
				this.del_list = val;
            },
            handleEnable(val) { // 恢复操作
				this.enableDelVisible = true;
				this.enable_list = val;
            }
       	},
       	watch:{
	        visible(val, oldVal){//监听编辑弹窗隐藏，清除编辑的id
	        	if(!val){
	        		this.form = {};
	        	}
	        }
	    }
	}
</script>

<style>
	
</style>