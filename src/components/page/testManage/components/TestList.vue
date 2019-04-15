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
        	<div class="test_content" style="display: none;">
        		<div class="test_html" id="ex">
        			<!--<p>【湖南省2017年考前演练卷（三）】利用下列实验装置进行相应的实验，不能达到实验目的的是</p>
        			<p><img src="data:image/png;base64,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"></p>
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
        					<el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(item.id,right_audit,right_shelf)" v-if="right_view">查看(管理)</el-button>
                   			<el-button type="text" icon="el-icon-edit" @click="handleEdit(item.id)" v-if="right_update">编辑</el-button>
                   			<el-button type="text" class="text-color-warning" icon="el-icon-lx-link" @click="handleBind(item.id)" v-if="right_bind">绑定</el-button>
                   			<el-button type="text" class="text-color-success" icon="el-icon-lx-exit" @click="handleExport(item.id)">导出</el-button>
		                    <!--<el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="(item.auditStatus == 5 || item.auditStatus == 15) && right_audit" @click="handleCheck(item.id,2)">审核</el-button>
                   			<el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="item.auditStatus == 10 && right_audit" @click="handleCheck(item.id,2)">反审核</el-button>
                    		<el-button type="text" class="text-color-success" icon="el-icon-lx-tag" v-if="item.shelfStatus == 5 && right_shelf" @click="handleCheck(item.id,3)">上架</el-button>
                    		<el-button type="text" class="text-color-success" icon="el-icon-lx-tag" v-if="item.shelfStatus == 10 && right_shelf" @click="handleCheck(item.id,3)">下架</el-button>-->
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
                right_bind: false, // 修改权限
                right_delete: false, // 删权限
                right_view: false, // 查看权限
                right_shelf: false,
                right_audit: false,
                total: 1
            }
        },
        activated() {
        	this.getData();
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
         			case "bind":that.right_bind = true;
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
            	let that = this;
            	$.ajax({
					 url:'app/question/message/list',
					 type:'get', //GET
					 async:false, //或false,是否异步
					 headers:{
					 	tokenId:localStorage.getItem("userToken")
					 },
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
					 },
					 dataType:'json', //返回的数据格式：
					 success:function(res){
					 	console.log(res)
					 	if(res.code == '0000'){
		                	that.total = res.data.total;
		                	// console.log(this.total)
		                    that.tableData = res.data.rows;
		                }
					 }
				})
//              this.$axios.get("app/question/message/list",{
//                  params:{
//                  	"courseId":this.courseId,//		学科ID
//						"knowledgeId":this.knowledgeId,//  知识元ID
//						"architectureId":this.architectureId,//	体系ID
//						"region":"",
//		    			"shelfStatus":"",
//                  	"name":"", // 试题名称
//						"questionType":this.questionType, // 题型
//						"year":this.year, // 年份
//						"questionDifficulty":this.questionDifficulty, // 难度系数类型（下拉选择）
//		    			"beginTime": this.beginTime, // 开始日期，没有则传空字符串或不传
//		    			"endTime": this.endTime, // 结束日期，没有则传空字符串或不传
//		    			"auditStatus": this.auditStatus, // 审核状态，没有则传空字符串或不传
//		    			"rows": 10, // 每页记录数，默认为25
//						"page": this.cur_page // 当前页码
//		    		}
//              }).then((res) => {
//              	if(res.status == 200 && res.data.code == '0000'){
//	                	this.total = res.data.data.total;
//	                	// console.log(this.total)
//	                    this.tableData = res.data.data.rows;
//	                }
//              })
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
//          	$("#ex").html(question[0].questionHtml);
//          	$("#ex").wordExport(question[0].courseName+"-"+question[0].questionTypeName+"-"+id);
//          	console.log(question[0]);
            	$("#"+id).wordExport(question[0].courseName+"-"+question[0].questionTypeName+"-"+id,question[0].questionHtml);
            },
            handleEdit(id) { // 编辑操作
                this.$router.push('/testUpdate?id='+id+'&path='+this.$route.path);
            },
            handleBind(id) { // 绑定操作
                this.$router.push('/testBind?id='+id+'&path='+this.$route.path);
            },
            handleCheck(id,auditStatus,shelfStatus) { // 查看操作
            	this.$router.push({
            		name:'testDetails',
            		params:{
	            		id:id,
	            		auditStatus:auditStatus,
	            		shelfStatus:shelfStatus,
	            		path:this.$route.path
            		}
            	});
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