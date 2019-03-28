<template>
	<div class="container">
		<div class="handle-box">
			<div class="demo-input-suffix">
				用户名称：
				<el-input v-model="userName" placeholder="" clearable class="handle-input-md m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				数据状态：
				<el-select v-model="dataStatus" placeholder="数据状态" class="handle-select m-r-10" @change="search">
	                <el-option key="1" label="启用" value="1" ></el-option>
	                <el-option key="0" label="停用" value="0" ></el-option>
	            </el-select>
			</div>
			<div class="demo-input-suffix">
				角色：
				<el-select v-model="roleId" placeholder="角色" class="handle-select m-r-10" @change="search">
	                <el-option key="0" label="全部" value="" ></el-option>
	                <el-option :key="item.id" :label="item.roleName" :value="item.id" v-for="item in roleList"></el-option>
	            </el-select>
	        </div>
	        <el-button type="primary" icon="search" @click="search" class="m-r-10">搜索</el-button>
	        <el-button type="primary" icon="search" @click="handleChange('add')" v-if="right_add">新增</el-button>
        </div>
        
        <!-- table-data -->
        <el-table :data="data" border class="table" stripe ref="multipleTable" >
            <el-table-column prop="userName" label="用户名称" >
            </el-table-column>
            <el-table-column prop="roleName" label="角色" width="180">
            </el-table-column>
            <el-table-column prop="loginId" label="登录账号" >
            </el-table-column>
            <el-table-column prop="loginTime" label="最后登录时间" width="180">
            </el-table-column>
            <el-table-column prop="dataStatusName" label="数据状态" >
            </el-table-column>
            <el-table-column prop="remark" label="备注" >
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
        
        <!-- 新增编辑 -->
        <el-dialog :title="title" :visible.sync="visible" width="40%">
        	<el-row :gutter="20">
        		<el-col :span="22">
					<el-form ref="form" :model="form" label-width="120px" :rules="rules"  class="demo-ruleForm">
					  <el-form-item label="用户名称:">
					    <el-input v-model="form.userName"></el-input>
					  </el-form-item>
					  <el-form-item label="登录账号:" v-if="isAdd">
					    <el-input v-model="form.loginId"></el-input>
					  </el-form-item>
					  <el-form-item label="登录密码:" v-if="isAdd">
					    <el-input type="password" v-model="form.loginPass" ></el-input>
					  </el-form-item>
					  <el-form-item label="确认登录密码:" prop="checkPass" v-if="isAdd">
					    <el-input type="password" v-model="agPass" autocomplete="off"></el-input>
					  </el-form-item>
					  <el-form-item label="角色:">
					    <el-select v-model="form.roleId" placeholder="请选择角色" class="handle-select m-r-10" @change="search">
			                <el-option :key="item.id" :label="item.roleName" :value="item.id" v-for="item in roleList"></el-option>
			            </el-select>
					  </el-form-item>
					  <el-form-item label="备注:">
					    <el-input v-model="form.remark"></el-input>
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
		name: "userInfo",
		data() {
			let validatePass = (rule, value, callback) => {
		        if (this.agPass === '') {
		          callback(new Error('请再次输入密码'));
		        	console.log(1)
		        } else if (this.agPass !== this.form.loginPass) {
		          callback(new Error('两次输入密码不一致!'));
		        	console.log(this.agPass)
		        } else {
		        	console.log(123)
		          callback();
		        }
		    };
            return {
                data: [], // table数据
                cur_page: 1, // 当前分页
                del_list: [], // 当前点击的删除ID
                enable_list:[], // 当前点击的恢复ID
                form:{
                	loginId: '',
                	loginPass: '',
                	roleId:'',
                	userName:'',
                	remark:''
                }, // 新增编辑表单
                agPass:'', // 确认密码
                visible: false, // 控制新增编辑弹窗
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false, // 控制恢复弹窗
                roleId: '', // 角色
                roleList:'', // 角色列表
		    	dataStatus: '1', // 数据状态， 默认搜索启用
		    	userName: '', // 用户名称
		    	rules: {
		          checkPass: [
		            { validator: validatePass, trigger: 'blur' }
		          ]
		        },
		    	title:'', // 弹框标题
		    	isAdd: false, // 判断是否是新增弹窗
                right_add: false, // 新增权限
                right_update: false, // 修改权限
                right_delete: false, // 删权限
                right_view: false, // 查看权限
                total: 1 // 分页数
            }
        },
        mounted() {
        	this.getRole(); //
         	this.getData();
         	
         	// 权限
         	let rights = JSON.parse(localStorage.getItem("ms_rights"));
         	let curRights = rights.filter(function(item){
         		return item.rightId.split(":")[0] == 'user';
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 list数据
            getData() {
                this.$axios.get("app/user/list",{
                    params:{
		    			"roleId": this.roleId, // 角色
		    			"dataStatus": this.dataStatus, // 数据状态
		    			"userName": this.userName, // 用户名称
		    			"rows": 10, // 每页记录数，默认为25
						"page": this.cur_page // 当前页码
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
                		console.log(res)
	                	this.total = res.data.data.total;
	                    this.data = res.data.data.rows;
	                }
                })
            },
            // 角色请求
            getRole(){
            	this.$axios.get("app/role/list",{
                    params:{
		    			"dataStatus": '1', // 数据状态
		    			"roleName": ""
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                    this.roleList = res.data.data.rows;
	                }
                })
            },
            search() { // 搜索
            	this.cur_page = 1;
                this.getData();
            },
            getDetails() { // 获取详情
            	this.$axios.get("app/user/get",{
                    params:{
		    			"id": this.form.id // ID
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.visible = true;
	                	this.form.id = res.data.data.id;
	                	this.form.roleId = res.data.data.roleId;
	                	this.form.userName = res.data.data.userName;
	                	this.form.remark = res.data.data.remark;
	                }
                })
            },
            sure() { // 新增编辑确定
            	let _url = '';
            	if(this.form.id){
            		_url = "app/user/update"; // 编辑
            	}else{
            		_url = "app/user/add"; // 新增
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
            	this.$axios.get("app/user/disable",{
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
            	this.$axios.get("app/user/enable",{
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
            	this.form.roleId = this.roleId;
				if(val == 'add'){ // 如果ID值存在跳编辑
					this.visible = true;
					this.title = '新增';
					this.isAdd = true;
				}else{
					this.form.id = val;
					this.title = '编辑';
					this.isAdd = false;
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