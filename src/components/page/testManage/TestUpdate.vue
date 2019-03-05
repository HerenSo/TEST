<template>
	<div class="container">
		<div class="p-40">
		<el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        	<el-row :gutter="20">
        		<el-col :span="24">
        			<el-form-item label="试题题干" required>
	                	<quill-editor ref="questionHtml" v-model="form.questionHtml" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
	                </el-form-item>
               	</el-col>
        		<el-col :span="24">
        			<el-form-item label="答案" required>
	                	<quill-editor ref="answerHtml" v-model="form.answerHtml" :options="editorOption" @change="answerEditorChange($event)"></quill-editor>
	                </el-form-item>
               	</el-col>
        		<el-col :span="12">
        			<el-form-item label="学科" required>
	        			<el-cascader
						    expand-trigger="hover"
						    :options="courses"
						    v-model="selectedOptions2"
						    :props="props"
						    @change="handleChange2">
						</el-cascader>
					</el-form-item>
        		</el-col>
        		<el-col :span="12">
	                <el-form-item label="区域">
	                    <el-input v-model="form.region"></el-input>
	                </el-form-item>
               	</el-col>
        		<el-col :span="12">
	                <el-form-item label="题型">
	                    <el-select  v-model="form.questionType" placeholder="请选择题型">
			                <el-option :key="item.id" :label="item.questionType" :value="item.id" v-for="item in questionTypeList"></el-option>
			            </el-select>
	                </el-form-item>
               	</el-col>
        		<el-col :span="12">
	                <el-form-item label="年份">
	                    <el-date-picker
					      v-model="form.year"
					      type="year"
					      value-format="yyyy"
					      placeholder="选择年">
					    </el-date-picker>
	                </el-form-item>
               	</el-col>
               	<el-col :span="12">
	                <el-form-item label="难度系数">
               			<el-select  v-model="form.diffculty" placeholder="请选择难度系数">
			                <el-option :key="item.id" :label="item.difficultyName" :value="item.id" v-for="item in questionDifficultyList"></el-option>
			            </el-select>
            		</el-form-item>
               	</el-col>
            </el-row>
        	<el-row :gutter="20">
        		<el-col :span="12">
                <el-form-item label="相关知识元" required>
                    <el-button type="button"  @click="handleSelect">选择知识元</el-button>
                </el-form-item>
              	</el-col>
        		<el-col>
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
              	</el-col>
           </el-row>
        </el-form>
        <div class="text-center">
	        <span slot="footer" class="dialog-footer">
	            <router-link :to='topath'class="m-r-10"><el-button >取 消</el-button></router-link>
	            <el-button type="primary" @click="saveAdd">确 定</el-button>
	        </span>
        </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="选择知识元" :visible.sync="selectVisible" width="60%">
        	<el-row :gutter="10">
        		<el-col :span="24">
        			<div class="p-10">
					   <el-cascader
					    expand-trigger="hover"
					    :options="courses"
					    v-model="selectedOptions"
					    :props="props"
					    @change="handleChange">
					  </el-cascader>
					</div>
					<div class="">
						<el-tree
						  :data="data"
						  show-checkbox
						  default-expand-all
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSelect">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
	import router from '@/router';
	export default{
		name: "testUpdate",
		components: {
            quillEditor
        },
		data() {
            return {
            	data: [],
                form: {},
                editorOption: {
                    placeholder: 'Hello World'
                },
                rules: {
		          name: [
		            { required: true, message: '请输入知识元名称', trigger: 'blur' }
		          ],
		          category: [
		            { required: true, message: '请选择学科类别', trigger: 'change' }
		          ],
	            },
	            courses: [], // 学科列表
		        material: [], // 教材列表
		        courseId: null, // 初始默认 学课ID
	            courseName: "", // 学科名称
                questionTypeList: [], // 题型列表
                questionDifficultyList: [], //难度系数列表
	            studyPeriod:"",
	            studyId:"",
	            typeName:"",
	            architectureType: [], // 体系类型
	            grade:[], // 年级列表
	            auditStatus: "",
	            defaultProps: {
		          children: 'children',
		          label: 'label'
		        },
		        props:{
		        	label:'studyPeriod',
		        	value: 'id',
            		children: 'courses'
		        },
		        selectedOptions:[],
		        selectedOptions2:[],
	            isDisable: true, // 防止重复提交
	            auditStatusName: "",
	            knowledges: [],
	            selectVisible: false,
	            topath: "" // 返回路径
            }
        },
        beforeRouteEnter (to, from, next) {
//		    console.log(from.path);
		    localStorage.setItem("backpath",from.path+"?localStorage=0");
		    next();
		},
        mounted() {
        	this.topath = localStorage.getItem("backpath"); // 获取返回路径
        	this.form.id = this.$route.query.id;
        	this.getDate(); // 获取详情
        	this.queryQuestionType();//获取题型列表
        	this.queryQuestionDifficulty();//获取难度系数
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
		          	this.courseId = this.courses[0].courses[0].id;
		          	this.studyPeriod = this.courses[0].studyPeriod;
		          	this.studyId = this.courses[0].id;
		          	this.courseName = this.courses[0].courses[0].courseName;
		          	this.selectedOptions = [this.studyId,this.courseId];
//		          	this.selectedOptions2 = [this.studyId,this.courseId];
	          	}
	        });
        	this.auditStatus = JSON.parse(localStorage.getItem("auditStatus"));
        },
        methods: {
        	onEditorChange({ editor, html, text }) {
                this.form.questionHtml = html;
//              console.log(html)
            },
        	answerEditorChange({ editor, html, text }) {
                this.form.answerHtml = html;
//              console.log(html)
            },
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
			handleChange2(value) { // 选择学科
		        console.log(value);
		        this.form.courseId = value[value.length-1];
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
			          	this.selectedOptions2 = [this.form.periodId,this.form.courseId];
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
			          	for(var i=0;i<this.questionDifficultyList.length;i++){
			          		if(this.questionDifficultyList[i].id == this.form.diffculty){
			          			this.form.difficultyName = this.questionDifficultyList[i].difficultyName;
			          		}
			          	}
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
			          	this.courseId = this.courses[0].courses[0].id;
			          	this.studyPeriod = this.courses[0].studyPeriod;
			          	this.courseName = this.courses[0].courses[0].courseName;
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
		    			this.form.knowledges.push({
			    			"knowledgeId":selectVal[i].id
//			    			knowledgeName:selectVal[i].label
			    		})
		    			this.knowledges.push({
			    			knowledgeId:selectVal[i].id,
			    			knowledgeName:selectVal[i].label
			    		})
		    		}
		    	}
		    	console.log(this.form.knowledges)
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
						    "Knowledges":this.form.Knowledges
		                }
		           ).then((res) => {
		           		if(res){
			            	if(res.status == 200 && res.data.code == '0000'){
				            	this.$message({
						          message: "提交成功",
						          type: 'success',
						          onClose:function(){
						          	router.push(this.topath);
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

<style>
	.el-date-editor.el-input{
		widows: 100%;
	}
</style>