<template>
	<div class="">
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
        </div>
        <div class="test_list" style="height: calc(100vh - 400px); overflow-y: auto">
			<ul>
				<el-radio-group v-model="bindId" @change="changeRadio" style="display: block">
					<li v-for="item in tableData" :key="item.id" :class="item.isSelect ? 'select':''">
						<div class="test_content">
							<el-radio :label="item.id" style="display: flex">
								<div class="test_html" v-html="item.questionHtml" ref="item.id" id="item.id"></div>
							</el-radio>
						</div>
						<div class="test_info">
							<span>难度系数:{{item.diffculty}}</span><span>使用次数:{{item.dataStatus}}</span><span>题型:{{item.questionTypeName}}</span><span>更新:{{item.updateTime}}</span>
						</div>
					</li>
				</el-radio-group>
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
        </div>
        
	</div>
</template>
<script>
    import bus from '../../../common/bus';
	export default{
		name: "TestSelect",
		data() {
            return {
                tableData: [],
                cur_page: 1,
                cur_pagesize: 10,
                bindId:[], // 绑定ID
                courseId: "",
				courses:[],
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
                idx: -1,
				isCoursesCon:false, // 是否显示学科搜索
                fullscreenLoading:false, // 加载中
                total: 1,
                records:0 // 总条数
            }
        },
        mounted() {

//      	this.queryExamType(); // 获取考试类型
        	this.queryQuestionType();//获取题型列表
        	this.queryQuestionDifficulty();//获取难度系数
			this.getCourse() // 请求学科数据
     		this.getData();
			this.isCoursesCon = true;
			
         	
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
            search() {  // 搜索
            	this.cur_page = 1;
                this.getData();
            },
			changeRadio(val) {
				console.log(val)
				bus.$emit('selectQuestionId', val)
				this.bindId = val
				this.tableData = this.tableData.map(item => {
					item.isSelect = false
					if(item.id === val) {
						item.isSelect = true
					}
					return item
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
			coursesSelect(val){  // 试题搜索时 选择学科
				this.courseId = val[1];
				this.getData();
				console.log(val)
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
	.test_list ul li.select{
		border: 1px solid #92b6ec;
	}
</style>