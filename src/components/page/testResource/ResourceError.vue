<template>
	<div class="container">
		<div class="handle-box">
			<!--<div class="demo-input-suffix">
				资源异常类型名称：
				<el-input v-model="exceptionType" placeholder="" clearable class="handle-input-md m-r-10"></el-input>
			</div>-->
			<div class="demo-input-suffix">
				资源异常类型：
				<el-select v-model="resoureType" placeholder="资源异常类型" class="handle-select m-r-10" @change="search">
	                <el-option key="0" label="全部" value="" ></el-option>
	                <el-option :key="item.id" :label="item.label" :value="item.id" v-for="item in resourceErrorTypeList"></el-option>
	            </el-select>
			</div>
			<div class="demo-input-suffix">
				上报时间：
				<el-date-picker
				  class="data_range m-r-10"
			      v-model="date"
			      type="daterange"
			      range-separator="至"
			      start-placeholder="开始"
			      end-placeholder="结束"
			      value-format="yyyy-MM-dd"
			      @change="search">
			    </el-date-picker>
			</div>
			<div class="demo-input-suffix">
				处理时间：
				<el-date-picker
				  class="data_range m-r-10"
			      v-model="dateHandle"
			      type="daterange"
			      range-separator="至"
			      start-placeholder="开始"
			      end-placeholder="结束"
			      value-format="yyyy-MM-dd"
			      @change="search">
			    </el-date-picker>
			</div>
			<div class="demo-input-suffix">
				是否处理：
				<el-select v-model="isHandle" placeholder="是否处理" class="handle-select m-r-10" @change="search">
	                <el-option key="3" label="全部" value="" ></el-option>
	                <el-option key="5" label="上传" value="5" ></el-option>
	                <el-option key="10" label="处理完成" value="10" ></el-option>
	            </el-select>
			</div>
	        <el-button type="primary" icon="search" @click="search" class="m-r-10">搜索</el-button>
        </div>
        
        <!-- table-data -->
        <el-table :data="data" border class="table" stripe ref="multipleTable" >
            <el-table-column prop="exresourceId" label="资源ID" width="250">
            </el-table-column>
            <el-table-column prop="resoureTypeName" label="异常类型名称" >
            </el-table-column>
            <el-table-column prop="exporterName" label="上报人名称">
            </el-table-column>
            <el-table-column prop="handleName" label="处理人名称" >
            </el-table-column>
            <el-table-column prop="exportTime" label="上报时间" width="160">
            </el-table-column>
            <el-table-column prop="handleTime" label="处理时间" width="160">
            </el-table-column>
            <el-table-column prop="isHandleName" label="处理状态名称" >
            </el-table-column>
            <el-table-column prop="remark" label="备注" >
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleChange(data[scope.$index].id)" v-if="right_handle">处理</el-button>
                    <el-button type="text" class="red" v-if="right_delete" icon="el-icon-delete" @click="handleDelete(data[scope.$index].id)">删除</el-button>
                    <!--<el-button type="text" class="red" v-if="data[scope.$index].dataStatus == 0 && right_delete" icon="el-icon-refresh" @click="handleEnable(data[scope.$index].id)">恢复</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-count="total" layout="prev, pager, next">
            </el-pagination>
        </div>
        <!--table-data END-->
        
        <!-- 新增编辑 -->
        <el-dialog title="处理" :visible.sync="visible" width="40%">
        	<el-row :gutter="20">
        		<el-col :span="22">
					<el-form ref="form" :model="form" label-width="130px">
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
    import bus from '../../common/bus';
	export default{
		name: "resourceError",
		data() {
            return {
                data: [], // table数据
                cur_page: 1, // 当前分页
                resourceTypeList:[],// 资源类型列表
                resourceErrorTypeList:[], // 资源异常类型列表
                multipleSelection: [], // 点击当前tr
                del_list: [], // 当前点击的删除ID
                enable_list:[], // 当前点击的恢复ID
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false, // 控制恢复弹窗
                visible: false, // 控制新增编辑弹窗
                form:{
                	remark:'',
                	id:'' //排序
                }, // 新增编辑表单
		    	title:'', // 弹框标题
                exceptionType: '', // 名称检索
                isHandle: '', // 是否处理
                resoureType: '', //资源异常类型
                date:[],
                dateHandle:[],
                right_add: false, // 新增权限
                right_update: false, // 修改权限
                right_delete: false, // 删权限
                right_view: false, // 查看权限
                right_handle:false, // 处理权限
                total: 1 // 分页数
            }
        },
        computed: { // 计算开始和结束日期
            beginTime: function () {
            	if(this.date){
            		return this.date[0]
            	}
		    },
            endTime: function () {
            	if(this.date){
            		return this.date[1]
            	}
		    },
            beginHandleTime: function () {
            	if(this.dateHandle){
            		return this.dateHandle[0]
            	}
		    },
            endHandleTime: function () {
            	if(this.dateHandle){
            		return this.dateHandle[1];
            	}
		    }
        },
        mounted() {
         	// 权限
         	let rights = JSON.parse(localStorage.getItem("ms_rights"));
         	let curRights = rights.filter(function(item){
         		return item.rightId.split(":")[0] == 'resourceError';
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
         			case "handle":that.right_handle = true;
         			break;
         			default:break;
         		}
         	})
         	this.getData();
         	this.getResourceErrorType();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 list数据
            getData() {
                this.$axios.get("app/exception/resource/list",{
                    params:{
		    			"beginTime":this.beginTime, //上报开始时间
						"endTime":this.endTime,// =上报结束时间
						"beginHandleTime":this.beginHandleTime, // =处理开始时间
						"endHandleTime":this.endHandleTime, // =处理结束时间
						"exresourceId":'', // =资源ID
						"resoureType":this.resoureType, // =资源异常类型ID
						"isHandle": this.isHandle, // =是否处理(5:上传;10:处理完成)
						"exporterId": '' , // =上报人ID
						"handleId": '', // =处理人ID
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
            // 获取资源类型数组
            getResourceType() {
            	this.$axios.get("app/combobox/resource/type").then((res) => {
					if(res.status=="200" && res.data.code == '0000'){
						this.resourceTypeList = res.data.data;
					}
				})
            },
            // 获取资源异常类型数组
            getResourceErrorType() {
            	this.$axios.get("app/combobox/exception/resource/type").then((res) => {
					if(res.status=="200" && res.data.code == '0000'){
						this.resourceErrorTypeList = res.data.data;
					}
				})
            },
            getDetails() { // 获取详情
            	this.$axios.get("app/exception/resource/type/get",{
                    params:{
		    			"id": this.form.id // ID
		    		}
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.visible = true;
	                	this.form.id = res.data.data.id;
	                	this.form.exceptionType = res.data.data.exceptionType;
	                	this.form.seq = res.data.data.seq;
	                }
                })
            },
            search() { // 搜索
            	this.cur_page = 1;
                this.getData();
            },
            
            sure() { // 处理异常
            	this.$axios.post('app/exception/resource/handle',
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
            	this.$axios.get("app/exception/resource/delete",{
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
            	this.$axios.get("app/exception/resource/type/enable",{
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
            handleChange(val) { // 处理操作
				this.visible = true;
				this.form.id = val;
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