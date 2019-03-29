<template>
	<div class="container">
		<div class="handle-box">
			<div class="demo-input-suffix">
				题型：
				<el-select  v-model="questionType" placeholder="题型" class="handle-select m-r-10" @change="search">
	                <el-option key="0" label="全部" value="" ></el-option>
	                <el-option :key="item.id" :label="item.questionType" :value="item.id" v-for="item in questionTypeList"></el-option>
	            </el-select>
            </div>
			<div class="demo-input-suffix">
				难度：
				<el-select  v-model="questionDifficulty" placeholder="难度" class="handle-select m-r-10" @change="search">
	                <el-option key="0" label="全部" value="" ></el-option>
	                <el-option :key="item.id" :label="item.difficultyName" :value="item.difficultyName" v-for="item in questionDifficultyList"></el-option>
	            </el-select>	
           </div>
			<div class="demo-input-suffix m-r-10">
				年份：
				<el-date-picker
			      v-model="year"
			      type="year"
				  value-format="yyyy"
			      placeholder="选择年"
			      @change="search">
			    </el-date-picker>
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
	        <el-button type="primary" icon="search" @click="add" v-if="right_add">新增</el-button>
        </div>
        <div class="test_list">
        	<ul>
        		<li v-for="item in tableData">
        			<div class="test_content">
        				<!--<div>{{item.name}}</div>-->
        				<div class="test_html" v-html="item.questionHtml" ref="item.id"></div>
		          		<!--<div class="form">来源：市级联考</div>-->
        			</div>
        			<div class="test_info">
        				<span>难度系数:{{item.diffculty}}</span><span>使用次数:{{item.dataStatus}}</span><span>题型:{{item.questionTypeName}}</span><span>更新:{{item.updateTime}}</span>
        				<div class="handle">
        					<el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(item.id,1)" v-if="right_view">查看</el-button>
                   			<el-button type="text" icon="el-icon-edit" @click="handleEdit(item.id)" v-if="right_update">编辑</el-button>
                   			<el-button type="text" icon="el-icon-lx-exit" @click="handleExport(item.id)" v-if="right_update">导出</el-button>
		                    <el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="(item.auditStatus == 5 || item.auditStatus == 15) && right_audit" @click="handleCheck(item.id,2)">审核</el-button>
                   			<el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="item.auditStatus == 10 && right_audit" @click="handleCheck(item.id,2)">反审核</el-button>
                    		<el-button type="text" class="text-color-success" icon="el-icon-lx-tag" v-if="item.shelfStatus == 5 && right_shelf" @click="handleCheck(item.id,3)">上架</el-button>
                    		<el-button type="text" class="text-color-success" icon="el-icon-lx-tag" v-if="item.shelfStatus == 10 && right_shelf" @click="handleCheck(item.id,3)">下架</el-button>
                    		<el-button type="text" class="text-color-danger" icon="el-icon-lx-delete" v-if="item.dataStatus == 1 && right_delete" @click="handleDelete(item.id)">删除</el-button>
                    		<el-button type="text" class="text-color-danger" icon="el-icon-lx-refresh" v-if="item.dataStatus == 0 && right_delete" @click="handleEnable(item.id)">恢复</el-button>
        				</div>
        			</div>
        		</li>
        	</ul>
        	<div class="text-center p-tb-20" v-if="tableData.length == 0">暂无数据</div>
        </div>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-count="total" layout="prev, pager, next">
            </el-pagination>
        </div>
        
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
<!--<script type="text/javascript" src="../../../../untils/jquery-2.1.1.js"></script>
<script type="text/javascript" src="../../../../untils/FileSaver.js"></script>
<script type="text/javascript" src="../../../../untils/jquery.wordexport.js"></script>-->
<script>
    import bus from '../../../common/bus';
    import {jquery} from '../../../../untils/jquery-2.1.1';
    import {saveAs} from '../../../../untils/FileSaver';
    import {wordExport} from '../../../../untils/jquery.wordexport';
	export default{
		name: "testList",
		data() {
            return {
                tableData: [],
                cur_page: 1,
                del_list: [], // 删除ID
                enable_list:[], // 恢复ID
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false,  // 控制恢复弹窗
                courseId: "",
                selectedOptions: [],  // 学段学科选择绑定的ID
                studyCourses: '',
                knowledgeId: "", // 知识元Id
                architectureId: "", // 体系ID
                examType:"", // 考试类型
                questionType: "", // 题型
                questionDifficulty: "", //难度系数
                auditStatus:"", //审核状态
                examTypeList:[], // 考试类型列表
                questionTypeList: [], // 题型列表
                questionDifficultyList: [], //难度系数列表
                auditStatusList: [], //审核状态列表
                year:"",
                date:"",
                idx: -1,
                right_add: false, // 新增权限
                right_update: false, // 修改权限
                right_delete: false, // 删权限
                right_view: false, // 查看权限
                right_shelf: false,
                right_audit: false,
                total: 1
            }
        },
        created() {
        },
        mounted() {
//      	this.queryExamType(); // 获取考试类型
        	this.queryQuestionType();//获取题型列表
        	this.queryQuestionDifficulty();//获取难度系数
//      	this.getData();

			let rightName = ''; // 判断权限归属名称
			if(this.$route.path == "/testManage"){
				this.getData(); // 如果是试题管理页 直接加载数据
				rightName = 'question';
			}
			if(this.$route.path == "/testSystem"){
				rightName = 'questionArchitecture';
			}
			if(this.$route.path == "/testElement"){
				rightName = 'questionKnowledge';
			}
			
        	bus.$on('elParam', (data) => { // 监听tree组件传过来的值
        		this.courseId = data.id;
        		if(data.studyCourses){
        			this.knowledgeId = data.parentId;
        		}else{
        			this.architectureId = data.parentId;
        		}
        		this.selectedOptions = data.selectedOptions;
	      	})
        	
        	// 权限
         	let rights = JSON.parse(localStorage.getItem("ms_rights"));
         	let curRights = rights.filter(function(item){
         		return item.rightId.split(":")[0] == rightName;
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
         			case "shelf":that.right_shelf = true;
         			break;
         			case "audit":that.right_audit = true;
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
            // 获取数据
            getData() {
                this.$axios.get("app/question/message/list",{
                    params:{
                    	"courseId":this.courseId,//		学科ID
						"knowledgeId":this.knowledgeId,//  知识元ID
						"architectureId":this.architectureId,//	体系ID
						"region":"",
		    			"shelfStatus":"",
                    	"name":"", // 试题名称
						"questionType":this.questionType, // 题型
						"year":this.year, // 年份
						"questionDifficulty":this.questionDifficulty, // 难度系数类型（下拉选择）
		    			"beginTime": this.beginTime, // 开始日期，没有则传空字符串或不传
		    			"endTime": this.endTime, // 结束日期，没有则传空字符串或不传
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
            search() {  // 搜索
            	this.cur_page = 1;
                this.getData();
            },
            add() { // 添加
            	this.$router.push({
            		path: '/testAdd',
            		query: { 
            			"path":this.$route.path,
	    				"selectedOptions": this.selectedOptions
	                }
            	})
            },
            sureDel() {// 确定删除
            	this.$axios.get("app/question/message/disable",{
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
            	this.$axios.get("app/question/message/enable",{
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
            queryExamType() {
                // 考试类型
		     	this.$axios.get('app/exam/type/tree').then(res => {
					if(res.status == 200 && res.data.code == '0000'){
			          	this.examTypeList = res.data.data;
			    	}
		        });
            },
            queryQuestionType() {
                // 题型
		     	this.$axios.get('app/question/type/tree').then(res => {
					if(res.status == 200 && res.data.code == '0000'){
			          	this.questionTypeList = res.data.data;
			    	}
		        });
            },
            queryQuestionDifficulty() {
                // 难度系数
		     	this.$axios.get('app/question/difficulty/tree').then(res => {
					if(res.status == 200 && res.data.code == '0000'){
			          	this.questionDifficultyList = res.data.data;
			    	}
		        });
            },
            handleExport(id) {
            	let question = this.tableData.filter(function(i){
            		return i.id == id;
            	})
            	console.log(question[0]);
//          	$("[ref='"+id+"']").wordExport(question[0].questionHtml,question[0].questionHtml);
            },
            handleEdit(id) { // 编辑操作
                this.$router.push('/testUpdate?id='+id+'&path='+this.$route.path);
            },
            handleCheck(id,type) { // 查看操作
                this.$router.push('/testDetails?id='+id+'&type='+type+'&path='+this.$route.path);
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
	        knowledgeId(val, oldVal){//普通的watch监听
	            this.cur_page = 1;
	            this.getData();
	        },
	        architectureId(val, oldVal){ // 
	        	this.cur_page = 1;
	        	this.getData();
	        }
	    }
	}
</script>

<style>
	.form{
		font-size: 12px;
		color: #999;
		padding: 18px 0;
	}
	.handle{
		float: right;
	}
</style>