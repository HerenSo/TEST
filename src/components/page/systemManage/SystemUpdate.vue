<template>
	<div class="container">
		<div class="form-box" style="width: 80%;">
		<el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        	<el-row :gutter="20">
        		<el-col :span="12">
	                <el-form-item label="节点名称" required>
	                    <el-input v-model="form.contentName"></el-input>
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
                <el-form-item label="审核状态">
                    <el-input v-model="auditStatusName" readonly></el-input>
                </el-form-item>
               </el-col>
            </el-row>
        	<el-row :gutter="20">
        		<el-col :span="12">
                <el-form-item label="创建人">
                    <el-input v-model="creator" readonly></el-input>
                </el-form-item>
               	</el-col>
        		<el-col :span="12">
                <el-form-item label="创建时间">
                    <el-input v-model="createTime" readonly></el-input>
                </el-form-item>
               </el-col>
        		<el-col :span="12">
                <el-form-item label="审核人">
                    <el-input v-model="auditor" readonly></el-input>
                </el-form-item>
               	</el-col>
        		<el-col :span="12">
                <el-form-item label="审核时间">
                    <el-input v-model="auditTime" readonly></el-input>
                </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="text-center">
	        <span slot="footer" class="dialog-footer">
	            <router-link to='elementManage'class="m-r-10"><el-button >取 消</el-button></router-link>
	            <el-button type="primary" @click="saveEdit" >确 定</el-button>
	        </span>
        </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="选择知识元" :visible.sync="selectVisible" width="60%">
            <el-form ref="form" :model="form" label-width="120px">
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSelect">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import bus from '../../common/bus';
	import router from '@/router';
	export default{
		name: "systemUpdate",
		data() {
            return {
            	data: [],
                form: {
                	"id":null,			//	--ID
                	"owner": null,    //-归属人
                	"gradeId": null,   // 年级ID
                	"materialId":null,	// --教材ID
                    "type": '', // 
                    "category":"",		//--学科类别
                    "courseId":null,			//--学科ID
				    "parentId":null,		//	--父节点ID
				    "seq":"",			//	--排序
				    "remarks":"",	//		--备注
				    "knowledges":[],			//--知识元数组
				    "contentName":""		// --体系名称
                },
                rules: {
		          typeName: [
		            { required: true, message: '请输入体系名称', trigger: 'blur' }
		          ]
	            },
	            courses: [], // 学科列表
		        material: [], // 教材列表
		        periodId:"",
		        studyPeriod:'', // 初始默认 学级
		        courseName:'', // 初始默认 学课
		        courseId: null, // 初始默认 学课ID
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
	            isDisable: true,
	            auditor: "",
	            auditTime: "",
	            auditStatusName: "",
	            creator: "",
	            createTime: "",
//	            knowledges: [],
	            selectVisible: false
            }
       },
        created(){
        	this.form.id = this.$route.query.id;
         	console.log(this.form.id)
        },
        mounted() {
         	this.$axios.get("app/architectureTree/get",{
                params:{
	    			"id": this.form.id
	    		}
            }).then((res) => {
            	if(res.status == 200 && res.data.code == '0000'){
	            	let data = res.data.data;
	                this.form.id = data.id;
	                this.form.owner = data.owner;
	                this.form.gradeId = data.gradeId;
	                this.form.materialId = data.materialId;
	                this.form.type = data.type;
	                this.form.category = data.category;
	                this.form.courseId = data.courseId;
	                this.form.parentId = data.parentId;
	                this.form.seq = data.seq;
	                this.form.remarks = data.remarks;
	                this.form.knowledges = data.knowledges;
	                this.form.contentName = data.contentName;
	                this.creator = data.creator;
	                this.createTime = data.createTime;
	                this.auditor = data.auditor;
	                this.auditTime = data.auditTime;
	                this.auditStatusName = data.auditStatusName;
//	                this.selectedOptions = [this.form.gradeId,this.form.courseId];
//	            	console.log(this.form)
            	}
            })
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
//		      	this.queryMaterial();
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
	//		          	this.courses = JSON.parse(JSON.stringify(res.data.data));
			          	this.courses = res.data.data;
			          	for(var i=0; i < this.courses.length; i++){
			          		for(var j=0; j < this.courses[i].courses.length;j++){
			          			this.courses[i].courses[j].studyPeriod = this.courses[i].courses[j].courseName;
			          		}
			          	}
			          	this.periodId = this.courses[0].id;
			          	this.courseId = this.courses[0].courses[0].id;
			          	this.studyPeriod = this.courses[0].studyPeriod;
			          	this.courseName = this.courses[0].courses[0].courseName;
			          	this.selectedOptions = [this.periodId,this.courseId];
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
		    	console.log(this.form.knowledges)
		    },
        	// 保存编辑
            saveEdit() {
            	if(this.form.knowledges.length <= 0){
            		this.$message({
			          message: "请选择知识元",
			          type: 'warning'
			        });
			        return;
            	}
            	if(this.isDisable){
            		this.isDisable = false;
            		this.$axios.post("app/architectureTree/update",
	                	this.form
		            ).then((res) => {
		            	if(res.status == 200 && res.data.code == '0000'){
			            	this.$message({
					          message: "提交成功",
					          type: 'success',
					          onClose:function(){
					          	router.push('/systemManage');
					          }
					        });
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