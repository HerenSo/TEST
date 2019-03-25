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
	                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in roleList"></el-option>
	            </el-select>
	        </div>
	        <el-button type="primary" icon="search" @click="search" class="m-r-10">搜索</el-button>
	        <el-button type="primary" icon="search" @click="add">新增</el-button>
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
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(data[scope.$index].id,data[scope.$index].courseId,data[scope.$index].parentId)">编辑</el-button>
                    <el-button type="text" class="red" v-if="data[scope.$index].dataStatus == 1" icon="el-icon-delete" @click="handleDelete(data[scope.$index].id)">删除</el-button>
                    <el-button type="text" class="red" v-if="data[scope.$index].dataStatus == 0" icon="el-icon-refresh" @click="handleEnable(data[scope.$index].id)">恢复</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-count="total" layout="prev, pager, next">
            </el-pagination>
        </div>
        <!--table-data END-->
        
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
            return {
                data: [], // table数据
                cur_page: 1, // 当前分页
                del_list: [], // 当前点击的删除ID
                enable_list:[], // 当前点击的恢复ID
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false, // 控制恢复弹窗
                roleId: '', // 角色
                roleList:'', // 角色列表
		    	dataStatus: '1', // 数据状态， 默认搜索启用
		    	userName: '', // 用户名称
                date: '', // 日期检索
                total: 1 // 分页数
            }
        },
        mounted() {
         	this.getData();
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
            search() { // 搜索
            	this.cur_page = 1;
                this.getData();
            },
            add() { // 新增
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
            handleEdit(id,courseId,parentId) { // 编辑操作
            	this.$router.push('/elementUpdate?id='+id);
            },
            handleCheck(id,courseId,parentId) { // 查看操作
            	console.log(id);
                this.$router.push('/elementDetails?id='+id);
            },
            handleDelete(val) { // 删除操作
				this.delVisible = true;
				this.del_list = val;
            },
            handleEnable(val) { // 恢复操作
				this.enableDelVisible = true;
				this.enable_list = val;
            }
       	}
	}
</script>

<style>
	
</style>