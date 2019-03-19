<template>
	<div class="container">
		<div class="form-box">
		<el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        	<el-row :gutter="20">
        		<el-col :span="12">
	                <el-form-item label="体系名称" required>
	                    <el-input v-model="form.contentName"></el-input>
	                </el-form-item>
               	</el-col>
        		<el-col :span="12">
                <el-form-item label="体系类型" required>
                    <el-select v-model="form.type" placeholder="请选择体系类型">
				      <el-option :label="item.label" :value="item.value" v-for="item in architectureType"></el-option>
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
        	<el-row :gutter="20">
        		<el-col :span="12">
                <el-form-item label="学科">
                    <el-input v-model="form.courseName" readonly></el-input>
                    <el-input v-model="form.courseId" class="hidden"></el-input>
                    <el-input v-model="form.parentId" class="hidden"></el-input>
                </el-form-item>
               	</el-col>
        		<el-col :span="12">
                <el-form-item label="科类" prop="category">
                	<el-select v-model="form.category" placeholder="请选择科类">
				      <el-option label="普文" value="普文"></el-option>
				      <el-option label="普理" value="普理"></el-option>
				    </el-select>
                </el-form-item>
                </el-col>
        		<el-col :span="12">
                <el-form-item label="归属人">
                	<el-input v-model="form.owner"></el-input>
                </el-form-item>
               </el-col>
        		<el-col :span="12">
                <el-form-item label="排序">
                    <el-input v-model="form.seq"></el-input>
                </el-form-item>
               	</el-col>
               	<el-col :span="24">
               	<el-form-item label="备注">
				    <el-input type="textarea" v-model="form.remarks"></el-input>
				</el-form-item>
				</el-col>
            </el-row>
            </el-row>
        </el-form>
        <div class="text-center">
	        <span slot="footer" class="dialog-footer">
	            <router-link to='systemType' class="m-r-10"><el-button >取 消</el-button></router-link>
	            <el-button type="primary" @click="saveAdd">确 定</el-button>
	        </span>
        </div>
        </div>
        <!-- 选择知识元弹出框 -->
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
		name: "systemTable",
		data() {
            return {
            	data: [],
                form: {
                    "owner":"",		//		--归属人
//				    "gradeId":"",		//		--年级ID
				    "materialId":"",	//		--教材ID
				    "type":"5",			//		--体系类型
				    "category":"普理",	//		--学科类别
				    "courseId":"",		//		--学科ID
				    "parentId":"",	//			--父节点ID
				    "fascicleId":"",
				    "seq":"",	//				--排序
				    "remarks":"",//				--备注
				    "knowledges":[],//			--知识元数组
				    "contentName":""	//	--体系名称
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
	            isDisable: true, // 防止重复提交
	            auditStatusName: "",
	            selectVisible: false
            }
        },
        mounted() {
        	this.form.courseName = this.$route.query.courseName;
        	this.form.courseId = this.$route.query.courseId;
        	this.form.parentId = this.$route.query.parentId;
        	this.form.materialId = this.$route.query.materialId;
        	this.form.fascicleId = this.$route.query.fasciclesId;
        	this.auditStatus = JSON.parse(localStorage.getItem("auditStatus"));
        	this.selectedOptions = this.$route.query.selectedOptions;
        	this.queryArchitectureType();
//      	this.queryGrade();
        },
        methods: {
        	handleClose(tag) { // 删除知识元
		        this.form.knowledges.splice(this.form.knowledges.indexOf(tag), 1);
		        console.log(this.form.knowledges);
		    },
		    handleSelect() { // 点击选择知识元
				this.data = [];
		    	this.queryCourse(); // 请求学科
		    	this.selectVisible = true; // 控制弹窗显示隐藏
		    },
			handleChange(value) { // 选择学科
		        console.log(value);
		        this.courseId = value[value.length-1];
		      	this.queryCoursesData();
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
			          	this.courseId = this.selectedOptions[1];
			          	this.studyId = this.selectedOptions[0];
//			          	this.selectedOptions = [this.studyId,this.courseId];
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
		    queryArchitectureType() {
		    	// 请求体系类型
		        this.$axios.get('app/combobox/architecture/type').then(res => {
		        	console.log(res)
		          	if(res.status == 200 && res.data.code == '0000'){
			          	this.architectureType = res.data.data;
		          	}
		       	});
		    },
		    queryGrade() {
		    	// 请求年纪
		        this.$axios.get('app/study/grade/tree',{
		        	params:{
		        		periodId:this.form.materialId
		        	}
		        }).then(res => {
		        	console.log(res)
		          	if(res.status == 200 && res.data.code == '0000'){
			          	this.grade = res.data.data;
		          	}
		       	});
		    },
		    // 确定选择
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
			    			knowledgeId:selectVal[i].id,
			    			knowledgeName:selectVal[i].label
			    		})
		    		}
		    	}
		    },
        	// 保存编辑
            saveAdd() {
            	if(this.isDisable){
            		this.isDisable = false;
	            	this.$axios.post("app/architectureTree/add",
		                this.form
		           ).then((res) => {
		           		if(res){
			            	if(res.status == 200 && res.data.code == '0000'){
//				            	this.$message({
//						          message: "提交成功",
//						          type: 'success',
//						          onClose:function(){
//						          	router.push('/systemType');
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
						          router.push('/systemType?localStorage=0');          
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
</style>