<template>
	<div class="container">
		<div class="handle-box">
			<el-select  v-model="questionType" placeholder="题型" class="handle-select m-r-10">
                <el-option key="0" label="全部" value=" " ></el-option>
                <el-option :key="item.id" :label="item.questionType" :value="item.id" v-for="item in questionTypeList"></el-option>
            </el-select>
			<!--<el-select  v-model="examType" placeholder="考试类型" class="handle-select m-r-10">
                <el-option key="0" label="全部" value=" " ></el-option>
                <el-option :key="item.id" :label="item.examType" :value="item.id" v-for="item in examTypeList"></el-option>
            </el-select>-->
			<el-select  v-model="questionDifficulty" placeholder="难度" class="handle-select m-r-10">
                <el-option key="0" label="全部" value=" " ></el-option>
                <el-option :key="item.id" :label="item.difficultyName" :value="item.id" v-for="item in questionDifficultyList"></el-option>
            </el-select>
			<div class="demo-input-suffix m-r-10">
				年份：
				<el-date-picker
			      v-model="year"
			      type="year"
				  value-format="yyyy"
			      placeholder="选择年">
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
			      value-format="yyyy-MM-dd">
			    </el-date-picker>
			</div>
			<el-select v-model="auditStatus" placeholder="审核状态" class="handle-select m-r-10">
                <el-option key="0" label="全部" value=" " ></el-option>
                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in auditStatusList"></el-option>
            </el-select>
	        <el-button type="primary" icon="search" @click="search">搜索</el-button>
	        <el-button type="primary" icon="search" @click="add">新增</el-button>
        </div>
        <div class="test_list">
        	<ul>
        		<li v-for="item in tableData">
        			<div class="test_content">
        				<!--<div>{{item.name}}</div>-->
        				<div class="test_html" v-html="item.questionHtml"></div>
		          		<!--<div class="form">来源：市级联考</div>-->
        			</div>
        			<div class="test_info">
        				<span>难度系数:{{item.diffculty}}</span><span>使用次数:{{item.dataStatus}}</span><span>题型:{{item.questionTypeName}}</span><span>更新:{{item.updateTime}}</span>
        				<div class="handle">
        					<el-button type="text" icon="el-icon-lx-attention" @click="handleCheck(item.id,1)">查看</el-button>
                   			<el-button type="text" icon="el-icon-edit" @click="handleEdit(item.id)">编辑</el-button>
                    		<!--<el-button type="text"  icon="el-icon-delete" @click="handleCheck(item.id)">审核</el-button>-->
		                    <el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="item.auditStatus == 5 || item.auditStatus == 15" @click="handleCheck(item.id,2)">审核</el-button>
                   			<el-button type="text" class="text-color-warning" icon="el-icon-lx-warn" v-if="item.auditStatus == 10" @click="handleCheck(item.id,2)">反审核</el-button>
                    		<el-button type="text" class="text-color-success" icon="el-icon-lx-tag" v-if="item.shelfStatus == 5" @click="handleCheck(item.id,3)">上架</el-button>
                    		<el-button type="text" class="text-color-success" icon="el-icon-lx-tag" v-if="item.shelfStatus == 10" @click="handleCheck(item.id,3)">下架</el-button>
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
        
	</div>
</template>

<script>
    import bus from '../../../common/bus';
	export default{
		name: "testList",
		data() {
            return {
                tableData: [],
                cur_page: 1,
                select_cate: '',
                select_word: '',
                courseId: "",
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
                total: 1
            }
        },
        created() {
//      	this.queryExamType(); // 获取考试类型
        	this.queryQuestionType();//获取题型列表
        	this.queryQuestionDifficulty();//获取难度系数
        	bus.$on('elParam', (data) => {
        		this.courseId = data.id;
        		if(data.studyCourses){
        			this.knowledgeId = data.parentId;
        		}else{
        			this.architectureId = data.parentId;
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
						// console.log(this.auditStatusList)
					}
				})
         	}
            this.getData();
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
            // 获取 easy-mock 的模拟数据
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
            search() {
            	this.cur_page = 1;
                this.getData();
            },
            add() {
            	this.$router.push('/testAdd')
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
            handleEdit(id) {
                this.$router.push('/testUpdate?id='+id);
            },
            handleCheck(id,type) {
                this.$router.push('/testDetails?id='+id+'&type='+type);
            }
        },
       	watch:{
	        knowledgeId(val, oldVal){//普通的watch监听
	            console.log("a: "+val, oldVal);
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