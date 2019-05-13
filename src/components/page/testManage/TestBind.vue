<template>
	<div class="container">
		<div class="testbind">
			<el-form ref="form" :model="form" label-width="100px"  class="demo-ruleForm">
	    		<div class="word">
    				<label>试题题干：</label>
                	<div class="test_dethtml" v-html="form.questionHtml?form.questionHtml:'暂无'"></div>
    				<label>试题答案：</label>
                	<div class="test_dethtml" v-html="form.answerHtml?form.answerHtml:'暂无'"></div>
    				<label>试题解析：</label>
                	<div class="test_dethtml" v-html="form.analysisHtml?form.analysisHtml:'暂无'"></div>
    				<label>提示：</label>
                	<div class="test_dethtml" v-html="form.tips?form.tips:'暂无'"></div>
    				<label>备注：</label>
                	<div class="test_dethtml" v-html="form.remarks?form.remarks:'暂无'"></div>
	            </div>
	    		<div class="element">
	                <el-form-item label="相关知识元" required>
	                    <el-button type="button"  @click="handleSelect">选择知识元</el-button>
	                </el-form-item>
	                <el-form-item label="已选知识元">
	              		<div class="demo-block">
	              			<el-tag
							  :key="tag.knowledgeId"
							  v-for="tag in form.knowledges"
							  closable
							  :disable-transitions="false"
							  @close="handleClose(tag)">
							  {{tag.knowledgeName}}
							</el-tag>
	              		</div>
	              	</el-form-item>
	              	<el-row :gutter="10" class="p-tb-20">
		        		<el-col :span="12">
		        			<el-form-item label="学科:">
		        				<el-input v-model="form.periodName+'/'+form.courseName" readonly></el-input>
			                </el-form-item>
		               	</el-col>
		        		<el-col :span="12">
		        			<el-form-item label="题型:">
		        				<el-input v-model="form.questionTypeName" readonly></el-input>
			                </el-form-item>
		               	</el-col>
		        		<el-col :span="12">
		        			<el-form-item label="难度:">
		        				<el-input v-model="form.diffculty" readonly></el-input>
			                </el-form-item>
		               	</el-col>
		        		<el-col :span="12">
		        			<el-form-item label="区域:">
		        				<el-input v-model="form.region" readonly></el-input>
			                </el-form-item>
		               	</el-col>
		        		<el-col :span="12">
		        			<el-form-item label="年份:">
		        				<el-input v-model="form.year" readonly></el-input>
			               </el-form-item>
		               </el-col>
		            </el-row>
	           </div>
	        </el-form>
	        <div class="text-center">
		        <span slot="footer" class="dialog-footer">
		            <router-link :to='topath' class="m-r-10"><el-button >取 消</el-button></router-link>
		            <el-button type="primary" @click="saveAdd">确 定</el-button>
		        </span>
	        </div>
        </div>
        <!-- 选择知识元弹出框 -->
        <el-dialog title="选择知识元" :visible.sync="selectVisible" width="40%">
        	<el-row :gutter="10">
        		<el-col :span="12">
        			<div class="p-10">
<!--					   <el-cascader-->
<!--					    expand-trigger="hover"-->
<!--					    :options="courses"-->
<!--					    v-model="selectedOptions"-->
<!--					    :props="props"-->
<!--					    @change="handleChange">-->
<!--					  </el-cascader>-->
						<el-input type="" v-model="form.periodName+'/'+form.courseName" readonly></el-input>
					</div>
				</el-col>
				<el-col :span="24">
					<div class="">
						<el-tree
						  class="element_tree"
						  :data="data"
						  show-checkbox
						  check-on-click-node
						  node-key="id"
						  ref="tree"
						  highlight-current
						  :props="defaultProps"
						  accordion
						  @node-click="">
						</el-tree>
					</div>
        		</el-col>
           	</el-row>
    		<el-col :span="12" class="remarks">
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form.remarks" readonly></el-input>
            </el-form-item>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSelect">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import router from '@/router';
	export default{
		name: "testBind",
		data() {
            return {
            	data: [],
                form: {},
	            courses: [], // 学科列表
		        material: [], // 教材列表
		        courseId: null, // 初始默认 学课ID
	            courseName: "", // 学科名称
	            studyPeriod:"",
				periodCourse:'',
	            studyId:"",
	            typeName:"",
	            architectureType: [], // 体系类型
	            defaultProps: {
		          children: 'children',
		          label: 'label'
		        },
		        props:{
		        	label:'studyPeriod',
		        	value: 'id',
            		children: 'courses'
		        },
		        selectedOptions:[], // 选择知识元中的 学段学科ID
	            isDisable: true, // 防止重复提交
	            knowledges: [],
	            selectVisible: false,
	            topath: "" // 返回路径
            }
       },
		created() {
        	this.topath = this.$route.query.path; // 获取返回路径
		},
        mounted() {
        	this.form.id = this.$route.query.id;
        	this.getDate(); // 获取详情
        },
        methods: {
        	handleClose(tag) { // 删除知识元
		        this.form.knowledges.splice(this.form.knowledges.indexOf(tag), 1);
		        console.log(this.form.knowledges);
		    },
		    handleSelect() { // 点击选择知识元
		    	this.queryCourse(); // 请求学科
		    	this.selectVisible = true; // 控制弹窗显示隐藏
		    },
			handleChange(value) { // 选择学科
		        console.log(value);
		        this.courseId = value[value.length-1];
		      	this.queryCoursesData();
		   },
		    getDate() {
		    	// 详情
		    	this.$axios.get('app/question/message/get',{
		    		params:{
		    			"id": this.form.id
		    		}
				}).then(res => {
					if(res.status == 200 && res.data.code == '0000'){
			          	this.form = res.data.data;
	                	this.form.remarks = this.form.remarks ? this.form.remarks : ''; // 后台暂未有备注字段，需判断
	                	
	                	this.courseId = this.form.courseId;
			          	this.selectedOptions = [this.form.periodId,this.form.courseId];
						this.queryCoursesData();
			    	}
		        });
		    },
		    queryCourse() {
		      	// 学科
				this.$axios.get('app/study/period/tree',{
		    		params:{
		    			"haveCourse": "1",
		    			"haveGrade": "0"
		    		}
				}).then(res => {
		          	if(res.status == 200 && res.data.code == '0000'){
	//		          	this.courses = JSON.parse(JSON.stringify(res.data.data));
			          	this.courses = res.data.data;
			          	for(var i=0; i < this.courses.length; i++){
			          		for(var j=0; j < this.courses[i].courses.length;j++){
			          			this.courses[i].courses[j].studyPeriod = this.courses[i].courses[j].courseName;
			          		}
			          	}
//			          	this.courseId = this.courses[0].courses[0].id;
//			          	this.studyPeriod = this.courses[0].studyPeriod;
//			          	this.courseName = this.courses[0].courses[0].courseName;
//			          	this.selectedOptions = [this.courses[0].id,this.courseId];
	    				this.queryCoursesData(); // 请求树
		          	}
		        });
		     },
		    queryCoursesData() {
		      	// 请求树
		        this.$axios.get('app/knowledgeTree/tree',{
		    		params:{
		    			"courseId": this.courseId
		    		}
				}).then(res => {
		          	if(res.status == 200 && res.data.code == '0000'){
			          	this.data = res.data.data;
	//		          	console.log(this.data);
			          	let data = {
			          		id:this.data[0].id,
			          		parentId:this.data[0].parentId
			          	}
	//		          	console.log(this.data)
		          	}
		       	});
		    },
		    // 确定选择知识元
		    saveSelect() {
		    	this.selectVisible = false; // 控制弹窗显示隐藏
		    	let selectVal = this.$refs.tree.getCheckedNodes();
		    	console.log(this.$refs.tree.getCheckedNodes());
		    	var flat;
		    	for(var i=0;i<selectVal.length;i++){
		    		flat = true;
		    		for(var j=0; j < this.form.knowledges.length;j++){
		    			if(selectVal[i].id == this.form.knowledges[j].knowledgeId){
		    				flat = false;
		    			}
		    		}
		    		if(flat){
//		    			this.form.knowledges.push({
//			    			"knowledgeId":selectVal[i].id
////			    			knowledgeName:selectVal[i].label
//			    		})
		    			this.form.knowledges.push({
			    			'knowledgeId':selectVal[i].id,
			    			'knowledgeName':selectVal[i].label
			    		})
		    		}
		    	}
		    	console.log(this.knowledges)
		    },
        	// 保存编辑
            saveAdd() {
            	if(this.isDisable){
            		this.isDisable = false;
	            	this.$axios.post("app/question/message/update",
		                {
		                	"id":this.form.id,				//--试题ID
    						"diffculty":this.form.diffculty,		//--难度系数
    						"year":this.form.year,			//--年份
						    "region":this.form.region,			//--地区
						    "courseId":this.form.courseId,			//--学科
						    "questionType":this.form.questionType,		//--题型
						    "questionHtml":this.form.questionHtml,		//--题干
						    "answerHtml":this.form.answerHtml,		//--答案
						    "knowledges":this.form.knowledges
		                }
		           ).then((res) => {
		           		if(res){
			            	if(res.status == 200 && res.data.code == '0000'){
		            			let topath = this.topath;
				            	this.$message({
						          message: "提交成功",
						          type: 'success',
						          onClose:function(){
//						            router.go(0);
						          	router.push(topath);
						          }
						        });
					        }
		           		}else{
				        	this.isDisable = true;
				        }
		            })
		        }
            }
       }
   }
</script>

<style scoped="scoped">
	.testbind{
		padding: 40px 10px;
	}
	.el-date-editor.el-input{
		widows: 100%;
	}
	.word{
		border: 1px solid #ebeef5;
		width: 794px;
	    padding: 30px 15px;
		min-width: 794px;
	    border-radius: 8px;
	}
	.word label{
		/*background: #ecf5ff;*/
	    padding: 6px 0px;
	    display: block;
	    /*margin-left: -10px;*/
	}
	.test_dethtml{
		margin-bottom: 20px;
	}
	.demo-ruleForm{
		display: flex;
		padding-bottom: 50px;
	}
	.element{
		border: 1px solid #ebeef5;
	    padding: 30px 15px;
	    border-radius: 8px;
	    margin-left: 20px;
	}
	.element_tree{
		overflow-x:inherit;
	}
</style>