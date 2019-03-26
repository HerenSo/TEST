<template>
	<div class="container">
		<div class="handle-box">
			<div class="demo-input-suffix">
				学段名称：
				<el-input v-model="studyPeriod" placeholder="" clearable class="handle-input-md m-r-10"></el-input>
			</div>
			<div class="demo-input-suffix">
				数据状态：
				<el-select v-model="dataStatus" placeholder="审核状态" class="handle-select m-r-10" @change="search">
	                <el-option key="1" label="启用" value="1" ></el-option>
	                <el-option key="0" label="停用" value="0" ></el-option>
	            </el-select>
			</div>
	        <el-button type="primary" icon="search" @click="search" class="m-r-10">搜索</el-button>
	        <el-button type="primary" icon="search" @click="handleChange('add')">新增</el-button>
        </div>
        
        <!-- table-data -->
        <el-table :data="data" border class="table" stripe ref="multipleTable" >
            <el-table-column prop="seq" label="排序"  align="center" width="100">
            </el-table-column>
            <el-table-column prop="id" label="学段id"  align="center" width="260">
            </el-table-column>
            <el-table-column prop="studyPeriod" label="学段名称"  align="center">
            </el-table-column>
            <el-table-column prop="dataStatusName" label="数据状态"  align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleChange(data[scope.$index].id)">编辑</el-button>
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
        
        <!-- 新增编辑 -->
        <el-dialog :title="title" :visible.sync="visible" width="40%">
        	<el-row :gutter="20">
        		<el-col :span="22">
					<el-form ref="form" :model="form" label-width="80px">
					  <el-form-item label="学段名称:">
					    <el-input v-model="form.studyPeriod"></el-input>
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
        <el-dialog  title="删除" :visible.sync="delVisible" width="40%">
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
		name: "studyPeriodInfo",
		data() {
            return {
                data: [], // table数据
                cur_page: 1, // 当前分页
                del_list: [], // 当前点击的删除ID
                enable_list:[], // 当前点击的恢复ID
                form:{
                	id:'',
                	studyPeriod:'',
                	seq:''
                }, // 新增编辑表单
                visible: false, // 控制新增编辑弹窗
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false, // 控制恢复弹窗
		    	dataStatus: '1', // 数据状态
		    	studyPeriod: '', // 学段名称
		    	title:'', // 弹框标题
                date: '', // 日期检索
                total: 1 // 分页数
            }
        },
        mounted() {
         	this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 list数据
            getData() {
                this.$axios.get("app/study/period/list",{
                    params:{
		    			"dataStatus": this.dataStatus, // 数据状态
		    			"studyPeriod": this.studyPeriod, // 用户名称
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
            getDetails() {
            	this.$axios.get("app/study/period/get",{
                    params:{
		    			"id": this.form.id // ID
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.visible = true;
	                	this.form.id = res.data.data.id;
	                	this.form.studyPeriod = res.data.data.studyPeriod;
	                	this.form.seq = res.data.data.seq;
	                }
                })
            },
            sure() { // 新增编辑确定
            	let _url = '';
            	if(this.form.id){
            		_url = "app/study/period/update";
            	}else{
            		_url = "app/study/period/add";
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
            	this.$axios.get("app/study/period/disable",{
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
            	this.$axios.get("app/study/period/enable",{
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
            	console.log(val)
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