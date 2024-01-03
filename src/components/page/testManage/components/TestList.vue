<template>
	<div class="container">
		<div class="handle-box" v-loading.fullscreen.lock="fullscreenLoading">
			<div class="demo-input-suffix" v-if="isCoursesCon">
				学科：
				<el-cascader
					expand-trigger="hover"
					:options="courses"
					v-model="selectedOptions"
					:value="studyCourses"
					:props="props"
					class="m-r-10"
					clearable
					@change="coursesSelect">
				</el-cascader>
			</div>
			<div class="demo-input-suffix">
				题型：
				<el-select  v-model="questionType" placeholder="题型" class="handle-select m-r-10" clearable @change="search">
	                <el-option key="0" label="全部" value="" ></el-option>
	                <el-option :key="item.id" :label="item.questionType" :value="item.id" v-for="item in questionTypeList"></el-option>
	            </el-select>
            </div>
			<div class="demo-input-suffix">
				难度：
				<el-select  v-model="questionDifficulty" placeholder="难度" class="handle-select m-r-10" clearable @change="search">
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
				  clearable
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
				  clearable
			      @change="search">
			    </el-date-picker>
			</div>
			<div class="demo-input-suffix">
				审核状态：
				<el-select v-model="auditStatus" placeholder="审核状态" class="handle-select m-r-10" clearable @change="search">
                	<el-option key="0" label="全部" value="" ></el-option>
                	<el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in auditStatusList"></el-option>
            	</el-select>
            </div>
			<div class="demo-input-suffix">
				知识元状态：
				<el-select v-model="haveKnowledge" placeholder="审核状态" class="handle-select m-r-10" clearable @change="search">
					<el-option key="0" label="全部" value="" ></el-option>
					<el-option key="5" label="未绑定" value="5" ></el-option>
					<el-option key="10" label="已绑定" value="10" ></el-option>
				</el-select>
			</div>
			<div class="demo-input-suffix">
				<el-input v-model="questionSearchText" placeholder="请输入关键词" class="handle-input-md m-r-10" clearable>
            	</el-input>
            </div>
	        <el-button type="primary" icon="search" @click="search">搜索</el-button>
	        <el-button type="primary" icon="search" @click="add" v-if="right_add">新增</el-button>
        </div>
        <div class="test_list">
        	<div class="test_content" style="display: none;">
        		<div class="test_html" id="ex">
        			<!--<p>【湖南省2017年考前演练卷（三）】利用下列实验装置进行相应的实验，不能达到实验目的的是</p>
        			<p>A．利用图甲装置，可快速制取氨气</p>
        			<p>B．利用图乙装置，用饱和碳酸钠溶液分离CH<sub>3</sub>CH<sub>2</sub>OH和CH<sub>3</sub>COOC<sub>2</sub>H<sub>5</sub>混合液</p>
        			<p>C．利用图丙装置，可制取乙烯并验证其易被酸性KMnO<sub>4</sub>溶液氧化</p>
        			<p>D．利用图丁装置，可说明浓H<sub>2</sub>SO<sub>4</sub>具有脱水性、强氧化性，SO<sub>2</sub>具有漂白性、还原</p>-->
        		</div>
				
			</div>
        	<ul>
        		<li v-for="item in tableData">
        			<div class="test_content">
        				<div class="test_html" v-html="item.questionHtml" ref="item.id" id="item.id"></div>
        			</div>
        			<div class="test_info">
        				<span>难度系数:{{item.diffculty}}</span><span>使用次数:{{item.dataStatus}}</span><span>题型:{{item.questionTypeName}}</span><span>更新:{{item.updateTime}}</span>
        				<div class="handle">
        					<el-button type="text" icon="el-icon-tickets" @click="handleCheckVariant(item.id)" v-if="right_view && isCoursesCon">变式题查看</el-button>
        					<el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(item.id)" v-if="right_view">查看(管理)</el-button>
                   			<el-button type="text" icon="el-icon-edit" @click="handleEdit(item.id)" v-if="right_update">编辑</el-button>
                   			<el-button type="text" :class="{'text-color-danger':item.haveKnowledge == 5}" icon="el-icon-lx-link" @click="handleBind(item.id)" v-if="right_bind">{{item.haveKnowledgeName}}</el-button>
                   			<el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" @click="handleError(item.id)" v-if="right_error">异常</el-button>
                   			<el-button type="text" class="text-color-success" icon="el-icon-lx-exit" @click="handleExport(item.id)" v-if="right_export">导出</el-button>
                    		<el-button type="text" class="text-color-danger" icon="el-icon-lx-delete" v-if="item.dataStatus == 1 && right_delete" @click="handleDelete(item.id)">删除</el-button>
                    		<el-button type="text" class="text-color-danger" icon="el-icon-lx-refresh" v-if="item.dataStatus == 0 && right_delete" @click="handleEnable(item.id)">恢复</el-button>
        				</div>
        			</div>
        		</li>
        	</ul>
        	<div class="text-center p-tb-20" v-if="tableData.length == 0">暂无数据</div>
        </div>
        <div class="pagination">
            <el-pagination background @size-change="handleSizeChange"
						   @current-change="handleCurrentChange"
						   :current-page="cur_page"
						   :page-sizes="[10, 20, 30,40, 50]"
						   :page-size="10"
						   :total="records"
						   :page-count="total"
						   layout="total,sizes,prev, pager, next,jumper">
            </el-pagination>
            <el-button>GO</el-button>
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
        
        
         <!-- 异常弹出框 -->
        <el-dialog title="异常" :visible.sync="errorVisible" width="50%">
            	<el-row :gutter="22">
            		<el-col :span="22">
            		<el-form ref="form" :model="form" label-width="130px">
					  <el-form-item label="资源异常类型">
					    <el-select v-model="form.resoureType" placeholder="资源异常类型" class="m-r-10" @change="">
			                <el-option :key="item.id" :label="item.label" :value="item.id" v-for="item in resourceErrorTypeList"></el-option>
			            </el-select>
					  </el-form-item>
					  <el-form-item label="备注:">
					    <el-input type="textarea" v-model="form.remark"></el-input>
					  </el-form-item>
					</el-form> 
					</el-col>
               </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="errorVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureError" >确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>
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
                cur_pagesize: 10,
                del_list: [], // 删除ID
                enable_list:[], // 恢复ID
                error_list:'', // 异常ID
                delVisible: false, // 控制删除弹窗
                enableDelVisible:false,  // 控制恢复弹窗
                errorVisible:false, // 控制异常弹窗
                courseId: "",
				courses:[],
				defaultProps: { // 知识元树数据配置
					children: 'children',
					label: 'label'
				},
				props:{ // 学科数据配置
					label:'studyPeriod',
					value: 'id',
					children: 'courses'
				},
                selectedOptions: [],  // 学段学科选择绑定的ID
                studyCourses: '',
                knowledgeId: "", // 知识元Id
                architectureId: "", // 体系ID
                examType:"", // 考试类型
                questionType: "", // 题型
                questionDifficulty: "", //难度系数
                auditStatus:"", //审核状态
                questionSearchText:"", //、试题搜索关键词
                examTypeList:[], // 考试类型列表
                questionTypeList: [], // 题型列表
                questionDifficultyList: [], //难度系数列表
                auditStatusList: [], //审核状态列表
				haveKnowledge:'', // 知识元状态
                year:"",
                date:"",
                form:{},
                resoureType: '', //资源异常类型
                resourceErrorTypeList:[], // 资源异常类型列表
                idx: -1,
				rightName: '',
                right_add: false, // 新增权限
                right_update: false, // 修改权限
                right_bind: false, // 修改权限
                right_delete: false, // 删权限
                right_view: false, // 查看权限
                right_shelf: false,
                right_audit: false,
				right_export:false, // 导出权限
                right_error:false, // 异常权限
				isCoursesCon:false, // 是否显示学科搜索
                fullscreenLoading:false, // 加载中
                total: 1,
                records:0 // 总条数
            }
        },
        activated() {
        	this.getData();
        },
        mounted() {

            bus.$on('fullscreenLoading', msg => { // 加载监听
                this.fullscreenLoading = msg;
            })

//      	this.queryExamType(); // 获取考试类型
        	this.queryQuestionType();//获取题型列表
        	this.queryQuestionDifficulty();//获取难度系数
			this.getCourse() // 请求学科数据
//      	this.getData();

			let rightName = ''; // 判断权限归属名称
			if(this.$route.path == "/testManage"){
				this.getData(); // 如果是试题管理页 直接加载数据
				rightName = 'question';
				this.isCoursesCon = true;
			}
			if(this.$route.path == "/testSystem"){
				rightName = 'questionArchitecture';
				this.isCoursesCon = false;
			}
			if(this.$route.path == "/testElement"){
				rightName = 'questionKnowledge';
				this.isCoursesCon = false;
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
         	let that = this;
         	let rights = JSON.parse(localStorage.getItem("ms_rights"));
         	let curRights = rights.filter(function(item){
         		return item.rightId.split(":")[0] == rightName;
         	})
         	let curRights2 = rights.filter(function(item){
         		return item.rightId.split(":")[0] == 'resourceError';
         	})
         	curRights.forEach(function(item){ // 权限处理
         		switch(item.rightId.split(":")[1]){
         			case "add":that.right_add = true; //新增
         			break;
         			case "update":that.right_update = true; // 编辑
         			break;
         			case "bind":that.right_bind = true; // 绑定知识元
         			break;
         			case "delete":that.right_delete = true; // 删除
         			break;
         			case "view":that.right_view = true; // 查看
         			break;
         			case "shelf":that.right_shelf = true; // 上架
         			break;
         			case "audit":that.right_audit = true; // 审核
         			break;
					case "export":that.right_export = true; // 导出
						break;
         			default:break;
         		}
         	})
         	curRights2.forEach(function(item){ // 权限处理
         		switch(item.rightId.split(":")[1]){
         			case "add":that.right_error = true; //新增
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
          	
			//资源异常类型列表
			this.getResourceErrorType();
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
            handleSizeChange(val){
				this.cur_pagesize = val;
				this.getData();
			},
			getCourse() {
				// 请求学科
				this.$axios.get('app/study/period/tree',{
					params:{
						"haveCourse": "1",
						"haveGrade": "0"
					}
				}).then(res => {
					if(res.status == 200 && res.data.code == '0000'){
						this.courses = res.data.data;
						for(var i=0; i < this.courses.length; i++){
							for(var j=0; j < this.courses[i].courses.length;j++){
								this.courses[i].courses[j].studyPeriod = this.courses[i].courses[j].courseName;
							}
						}
					}
				});
			},
            // 获取数据
            getData() {
            	let that = this;
				let hrefUrl = 'app/question/message/list'
				let params = {
					"courseId":this.courseId,//		学科ID
					"knowledgeId":this.knowledgeId,//  知识元ID
					"architectureId":this.architectureId,//	体系ID
					"region":"",
					"shelfStatus":"",
					"questionSearchText":this.questionSearchText, // 关键词
					"questionType":this.questionType, // 题型
					"year":this.year, // 年份
					"questionDifficulty":this.questionDifficulty, // 难度系数类型（下拉选择）
					"beginTime": this.beginTime, // 开始日期，没有则传空字符串或不传
					"endTime": this.endTime, // 结束日期，没有则传空字符串或不传
					"auditStatus": this.auditStatus, // 审核状态，没有则传空字符串或不传
					"haveKnowledge":this.haveKnowledge, // 知识元绑定状态
					"rows": this.cur_pagesize, // 每页记录数，默认为25
					"page": this.cur_page // 当前页码
				}
                this.$axios.get(hrefUrl,{
                    params: params
                }).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.total = res.data.data.total;
	                	this.records = res.data.data.records;
	                	// console.log(this.total)
	                    this.tableData = res.data.data.rows;
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
            sureError() { // 确定异常
            	this.form.exresourceId = this.error_list;
            	console.log(this.form)
            	this.$axios.post("app/exception/resource/add",
                    this.form
                ).then((res) => {
                	if(res.status == 200 && res.data.code == '0000'){
	                	this.errorVisible = false;
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
//          	$("#ex").html(question[0].questionHtml);
//          	$("#ex").wordExport(question[0].courseName+"-"+question[0].questionTypeName+"-"+id);
            	console.log(question[0]);
            	$("#"+id).wordExport(question[0].courseName+"-"+question[0].questionTypeName+"-"+id,question[0].questionHtml,question[0].answerHtml,question[0].analysisHtml || '暂无');
            },
			coursesSelect(val){  // 试题搜索时 选择学科
				this.courseId = val[1];
				this.getData();
				console.log(val)
			},
            handleEdit(id) { // 编辑操作
                this.$router.push('/testUpdate?id='+id+'&path='+this.$route.path);
            },
            handleBind(id) { // 绑定操作
                this.$router.push('/testBind?id='+id+'&path='+this.$route.path);
            },
            handleCheck(id,auditStatus,shelfStatus) { // 查看操作
            	this.$router.push({
            		path:'/testDetails',
            		query:{
	            		id:id,
	            		path:this.$route.path
            		}
            	});
            },
			handleCheckVariant(id,auditStatus,shelfStatus) { // 查看变式题操作
				const { href } = this.$router.resolve({
					path:'/testVariant',
            		query:{
	            		id:id,
	            		path:this.$route.path
            		}
				});
				window.open(href, '_blank');
            },
            handleError(val) { // 异常操作
				this.errorVisible = true;
				this.error_list = val;
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
	            if(this.knowledgeId){
	            	this.getData();
	            }else{
	            	this.tableData = [];
	            }
	        },
	        architectureId(val, oldVal){ // 
	        	this.cur_page = 1;
	        	if(this.architectureId){
	        		this.getData();
	        	}else{
	            	this.tableData = [];
	            }
	        },
	        errorVisible(val, oldVal){//监听编辑弹窗隐藏，清除编辑的id
	        	if(!val){
	        		this.form = {};
	        	}
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
    .pagination{
        display: flex;
        justify-content: flex-end;
    }
    .pagination .el-button{
        margin: 2px 5px;
        height: 28px;
        line-height: 28px;
        padding: 0 12px;
    }
</style>