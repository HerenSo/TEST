<template>
	<div class="container">
		<div class="p-40">
		<el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        	<el-row :gutter="20">
        		<el-col :span="24">
        			<el-form-item label="试题题干" required>
        				<!--<mavon-editor v-model="form.questionHtml" ref="questionHtml" @imgAdd="$imgAdd" @change="onEditorChange" style="min-height: 600px"/>-->
	                	<quill-editor ref="questionHtml" v-model="form.questionHtml" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
	                </el-form-item>
               	</el-col>
        		<el-col :span="24">
        			<el-form-item label="答案" required>
        				<!--<mavon-editor v-model="form.answerHtml" ref="answerHtml" @imgAdd="$imgAdd" @change="answerEditorChange" style="min-height: 600px"/>-->
	                	<quill-editor ref="answerHtml" v-model="form.answerHtml" :options="editorOption" @change="answerEditorChange($event)"></quill-editor>
	                </el-form-item>
               	</el-col>
        		<el-col :span="24">
        			<el-form-item label="解析" required>
	                	<quill-editor ref="analysisHtml" v-model="form.analysisHtml" :options="editorOption" @change="analysisEditorChange($event)"></quill-editor>
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
<!--	                    <el-input v-model="form.region"></el-input>-->
	                    <v-distpicker class="el-input" :placeholders="{ province: ''}" @selected="onSelected" type="type" only-province></v-distpicker>
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
						  v-for="tag in knowledges"
						  closable
						  :disable-transitions="false"
						  @close="handleClose(tag)">
						  {{tag.knowledgeName}}
						</el-tag>
              		</div>
              	</el-form-item>
              	</el-col>
        		<el-col :span="12" class="remarks">
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.remarks"></el-input>
                </el-form-item>
                </el-col>
           </el-row>
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
						  class="element_tree"
						  :data="data"
						  show-checkbox
						  node-key="id"
						  check-on-click-node
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
//  import { mavonEditor } from 'mavon-editor'
//  import 'mavon-editor/dist/css/index.css'
    import VDistpicker from 'v-distpicker'
	import router from '@/router';
	export default{
		name: "testAdd",
		components: {
            quillEditor,
//			mavonEditor,
            VDistpicker
        },
		data() {
            return {
            	data: [],
                form: {
				    "courseId":"",		//		--学科ID
				    "knowledges":[],//			--知识元数组
				    "questionHtml":""
                },
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
		        selectedOptions:[], // 选择知识元中的 学段学科ID
		        selectedOptions2:[], // 选中绑定的学段学科ID
	            isDisable: true, // 防止重复提交
	            auditStatusName: "",
	            knowledges: [],
	            selectVisible: false, // 控制选择知识元弹窗
	            topath: "" // 返回路径
            }
        },
		created() {
        	this.topath = this.$route.query.path; // 获取返回路径
        	let selectedOptions = this.$route.query.selectedOptions;
        	console.log(typeof selectedOptions);
        	if(selectedOptions){
        		this.selectedOptions2 = this.$route.query.selectedOptions;
	        	this.selectedOptions = this.$route.query.selectedOptions;
	        	this.form.courseId = this.selectedOptions2[this.selectedOptions2.length-1];
        	}
		},
        mounted() {
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
	          	}
	        });
        	this.auditStatus = JSON.parse(localStorage.getItem("auditStatus"));
        },
        methods: {
        	onEditorChange({ editor, html, text }) { 
                this.form.questionHtml = html; // 获取题干HTML
            },
        	answerEditorChange({ editor, html, text }) { 
                this.form.answerHtml = html; // 获取答案HTML
            },
        	analysisEditorChange({ editor, html, text }) { 
                this.form.analysisHtml = html; // 获取答案HTML
            },
			// 将图片上传到服务器，返回地址替换到md中
//          $imgAdd(pos, $file){
//              var formdata = new FormData();
//              formdata.append('file', $file);
//              // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
//              this.$axios({
//                  url: '/common/upload',
//                  method: 'post',
//                  data: formdata,
//                  headers: { 'Content-Type': 'multipart/form-data' },
//              }).then((url) => {
//                  this.$refs.md.$img2Url(pos, url);
//              })
//          },
//      	onEditorChange(value, render) { 
//      		// render 为 markdown 解析后的结果
//              this.form.questionHtml = render; // 获取题干HTML
//      		console.log(this.form.questionHtml);
//          },
//      	answerEditorChange(value, render) { 
//              this.form.answerHtml = render; // 获取答案HTML
//          },
            onSelected(data) { // 选择省
            	this.form.region = data.province.value;
            },
        	handleClose(tag) { // 删除知识元
		        this.form.knowledges.splice(this.form.knowledges.indexOf(tag), 1);
		        console.log(this.form.knowledges);
		    },
		    handleSelect() { // 点击选择知识元
				this.data = [];
				this.courseId = this.form.courseId;
	          	this.selectedOptions = [this.form.periodId,this.form.courseId];
		    	this.queryCourse(); // 请求学科
		    	this.selectVisible = true; // 控制弹窗显示隐藏
		    },
			handleChange(value) { // 选知识元选择学科
		        this.courseId = value[value.length-1];
		      	this.queryCoursesData();
		    },
			handleChange2(value) { // 新增时选择学科
		        this.form.courseId = value[value.length-1];
		        this.form.periodId = value[0];
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
		    queryCourse() {
		      	// 学科
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
			          	let data = {
			          		id:this.data[0].id,
			          		parentId:this.data[0].parentId
			          	}
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
	            	this.$axios.post("app/question/message/add",
		                this.form
		           ).then((res) => {
		           		if(res){
			            	if(res.status == 200 && res.data.code == '0000'){
		            			let topath = this.topath;
//				            	this.$message({
//						          message: "提交成功",
//						          type: 'success',
//						          onClose:function(){
//						          }
//						        });
						        this.$confirm('提交成功, 是否继续添加?', '是否继续', {
						          confirmButtonText: '继续',
						          cancelButtonText: '取消',
						          type: 'success'
						        }).then(() => {
						          router.go(0);
						        }).catch(() => {
//						          router.go(0);
						          router.push(topath);          
						        });
					        }else{
					        	this.isDisable = true;
					        }
		           		}
		            })
		        }
            }
       }
   }
</script>

<style scoped="scoped">
	.el-date-editor.el-input{
		widows: 100%;
	}
	.el-col.el-col-12{
		height: 50px;
	}
	.el-col.el-col-12.remarks{
		height: auto;
	}
	.element_tree{
		overflow-x:inherit;
	}
</style>