<template>
	<div class="container">
		<div class="form-box">
		<el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        	<el-row :gutter="20">
        		<el-col :span="12">
	                <el-form-item label="知识元名称" required>
	                    <el-input v-model="form.name"></el-input>
	                </el-form-item>
               	</el-col>
        		<!--<el-col :span="12">
                <el-form-item label="体系类型">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
               	</el-col>-->
        		<el-col :span="12">
                <el-form-item label="学科">
                    <el-input v-model="courseName" readonly></el-input>
                    <el-input v-model="form.courseId" class="hidden"></el-input>
                    <el-input v-model="form.parentId" class="hidden"></el-input>
                </el-form-item>
               	</el-col>
        		<el-col :span="12">
                <el-form-item label="科类" prop="category" required>
                	<el-select v-model="form.category" placeholder="请选择科类" >
				      <el-option label="普文" value="普文"></el-option>
				      <el-option label="普理" value="普理"></el-option>
				    </el-select>
                </el-form-item>
               	</el-col>
        		<!--<el-col :span="12">
                <el-form-item label="审核状态">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
               	</el-col>-->
        		<el-col :span="12">
                <el-form-item label="上架状态">
					<el-select v-model="form.shelfStatus" placeholder="请选择上架状态">
		                <el-option :key="item.id" :label="item.label" :value="item.acronym" v-for="item in shelfStatusList"></el-option>
		           </el-select>
                </el-form-item>
               	</el-col>
        		<!--<el-col :span="12">
                <el-form-item label="创建人">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
               	</el-col>-->
        		<!--<el-col :span="12">
                <el-form-item label="创建日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
               	</el-col>-->
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
        		<!--<el-col :span="12">
                <el-form-item label="审核日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                </el-col>-->
            </el-row>
        </el-form>
        <div class="text-center">
	        <span slot="footer" class="dialog-footer">
	            <router-link to='elementManage'class="m-r-10"><el-button >取 消</el-button></router-link>
	            <el-button type="primary" @click="saveAdd">确 定</el-button>
	        </span>
        </div>
        </div>
    </div>
</template>

<script>
	import router from '@/router';
	export default{
		name: "elementAdd",
		data() {
            return {
                form: {
                    "name": '', // 知识元名称
					"category": '普理', // 学科类别
					"courseId": null, //学科ID
					"parentId": null, // 父节点ID,顶级传0
					"seq": '', // 排序
					"shelfStatus": '5', //上架状态
					"remarks": '' //备注
                },
                rules: {
		          name: [
		            { required: true, message: '请输入知识元名称', trigger: 'blur' }
		          ],
		          category: [
		            { required: true, message: '请选择学科类别', trigger: 'change' }
		          ],
	            },
	            courseName: "", // 学科名称
	            shelfStatusList: [],
	            isDisable: true
            }
        },
        mounted() {
        	// console.log(this.$route.query)
        	this.courseName = this.$route.query.courseName;
        	this.form.courseId = this.$route.query.courseId;
        	this.form.parentId = this.$route.query.parentId;
        	this.shelfStatusList = JSON.parse(localStorage.getItem("shelfStatus"));
        },
        methods: {
        	// 保存编辑
            saveAdd() {
            	if(this.isDisable){
            		this.isDisable = false;
	            	this.$axios.post("app/knowledgeTree/add",
		                this.form
		            ).then((res) => {
		            	if(res.status == 200 && res.data.code == '0000'){
			            	this.$message({
					          message: "提交成功",
					          type: 'success',
					          onClose:function(){
					          	router.push('/elementManage');
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