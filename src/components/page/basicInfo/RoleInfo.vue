<template>
	<div class="container">
		<div class="handle-box">
			<div class="demo-input-suffix">
				角色名称：
				<el-input v-model="roleName" placeholder="" clearable class="handle-input-md m-r-10"></el-input>
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
            <el-table-column prop="id" label="角色id" align="center" width="160">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称"  align="center">
            </el-table-column>
            <el-table-column prop="dataStatusName" label="数据状态" width="180" align="center">
            </el-table-column>
            <el-table-column prop="remark" label="备注"  align="">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleChange(data[scope.$index].id)" v-if="right_update">编辑</el-button>
                    <el-button type="text" icon="el-icon-lx-settings" @click="handleAllot(data[scope.$index].id)" v-if="right_rights">分配</el-button>
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
        
        <!-- 新增编辑 -->
        <el-dialog :title="title" :visible.sync="visible" width="40%">
        	<el-row :gutter="20">
        		<el-col :span="22">
					<el-form ref="form" :model="form" label-width="80px">
					  <el-form-item label="角色名称:">
					    <el-input v-model="form.roleName"></el-input>
					  </el-form-item>
					  <el-form-item label="备注:">
					    <el-input type="textarea" v-model="form.remark"></el-input>
					  </el-form-item>
					</el-form>  
				</el-col>
			</el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="sure" >确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 分配弹出框 -->
        <el-dialog title="分配" :visible.sync="allotVisible" width="40%">
        	<el-row :gutter="20">
        		<el-col :span="2">&nbsp;</el-col>
        		<el-col :span="20">
					<el-tree
					  :data="rightTree"
					  show-checkbox
					  node-key="id"
					  check-on-click-node
					  ref="tree"
					  highlight-current
					  default-expand-all
					  :default-checked-keys="defaultChecked"
					  :props="defaultProps"
					  accordion
					  @node-click="">
					</el-tree>
				</el-col>
			</el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="allotVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotSure" >确 定</el-button>
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
                rightTree:[], // 权限树
                cur_page: 1, // 当前分页
                allot_list: '', // 当前点击的分配ID
                del_list: [], // 当前点击的删除ID
                enable_list:[], // 当前点击的恢复ID
                form:{
                	roleName:'',
                	remark:''
                }, // 新增编辑表单
                defaultProps: {
		          children: 'children',
		          label: 'title'
		        },
		        defaultChecked: [], // 默认选中
                visible: false, // 控制新增编辑弹窗
                allotVisible: false, // 控制分配弹窗
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false, // 控制恢复弹窗
		    	dataStatus: '1', // 数据状态， 默认搜索启用
		    	roleName: '', // 角色名称
		    	title:'', // 弹框标题
                right_add: false, // 新增权限
                right_update: false, // 修改权限
                right_delete: false, // 删权限
                right_rights: false, // 分配权限
                total: 1 // 分页数
            }
        },
        mounted() {
         	this.getData();
         	
         	// 权限
         	let rights = JSON.parse(localStorage.getItem("ms_rights"));
         	let curRights = rights.filter(function(item){
         		return item.rightId.split(":")[0] == 'role';
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
         			case "rights":that.right_rights = true;
         			break;
         			default:break;
         		}
         	})
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 list数据
            getData() {
                this.$axios.get("app/role/list",{
                    params:{
		    			"dataStatus": this.dataStatus, // 数据状态
		    			"roleName": this.roleName, // 角色名称
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
            getDetails() { // 获取详情
            	this.$axios.get("app/role/get",{
                    params:{
		    			"id": this.form.id // ID
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.visible = true;
	                	this.form.id = res.data.data.id;
	                	this.form.roleName = res.data.data.roleName;
	                	this.form.remark = res.data.data.remark;
	                }
                })
            },
            getRightTree() { // 请求权限树
            	this.$axios.get("app/role/rightTree",{
                    params:{
		    			"roleId": this.allot_list // ID
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.rightTree = res.data.data;
	                	let defaultChecked = [];
	                	var recursion = (data) => {
	                		if(data.length > 0){
	                			data.forEach(function(item){
	                				if(item.auth == true){
	                					defaultChecked.push(item.id);
	                				}
						            recursion(item.children);
						        });
	                		}
	                	}
	                	recursion(this.rightTree);
	                	this.defaultChecked = defaultChecked;
//	                	console.log(defaultChecked);
	                }
                })
            },
            sure() { // 新增编辑确定
            	let _url = '';
            	if(this.form.id){
            		_url = "app/role/update"; // 编辑
            	}else{
            		_url = "app/role/add"; // 新增
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
            allotSure() { // 分配确定
            	let rights = this.$refs.tree.getCheckedKeys().filter(function(i){
            		return i.indexOf(":") > 0;
            	});
            	rights = rights.map(function(item){
            		return {"rightId":item};
            	})
            	this.$axios.post('app/role/right/save',
                    {
                    	"id":this.allot_list,	// --角色ID
   						"rights": rights
                    }
                ).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.allotVisible = false;
	                	this.getData();
	                	this.$message.success(res.data.msg);
//						this.$router.go(0);
	                }
                })
            },
            sureDel() { // 确定删除
            	this.$axios.get("app/role/disable",{
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
            	this.$axios.get("app/role/enable",{
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
            handleAllot(val) { // 分配
            	this.allotVisible = true;
				this.allot_list = val;
	        	this.rightTree = [];
				this.getRightTree();
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
	.el-tree-node__content{
		height: 21px;
	}
</style>