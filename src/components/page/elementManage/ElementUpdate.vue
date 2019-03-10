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
        		<el-col :span="12">
                <el-form-item label="学科">
                    <el-input v-model="form.courseName" readonly></el-input>
                    <el-input v-model="form.courseId" class="hidden"></el-input>
                    <el-input v-model="form.parentId" class="hidden"></el-input>
                </el-form-item>
               	</el-col>
        		<el-col :span="12">
                <el-form-item label="科类" prop="category" required>
                	<el-select v-model="form.category" placeholder="请选择科类">
				      <el-option label="普文" value="普文"></el-option>
				      <el-option label="普理" value="普理"></el-option>
				    </el-select>
                </el-form-item>
               	</el-col>
        		<el-col :span="12">
                <el-form-item label="上架状态">
                    <el-input v-model="shelfStatusName" readonly></el-input>
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
        </el-form>
        <div class="text-center">
	        <span slot="footer" class="dialog-footer">
	            <router-link to='elementManage' class="m-r-10"><el-button >取 消</el-button></router-link>
	            <el-button type="primary" @click="saveEdit" >确 定</el-button>
	        </span>
        </div>
        </div>
    </div>
</template>

<script>
    import bus from '../../common/bus';
	import router from '@/router';
	export default{
		name: "elementUpdate",
		data() {
            return {
                form: {
                	"id": null,
                    "name": '', // 知识元名称
					"category": '', // 学科类别
					"courseName": '',// 学科name
					"courseId": '', //学科ID
					"parentId": '', // 父节点ID,顶级传0
					"seq": '', // 排序
					"shelfStatus": '', //上架状态
					"remarks": '' //备注
                },
                rules: {
		          name: [
		            { required: true, message: '请输入知识元名称', trigger: 'blur' }
		          ]
	            },
	            isDisable: true, // 防止重复提交
	            shelfStatusName: "" // 上架状态
            }
        },
        created(){
        	this.form.id = this.$route.query.id;
        },
        mounted() {
         	this.$axios.get("app/knowledgeTree/get",{
                params:{
	    			"id": this.form.id
	    		}
            }).then((res) => {
            	if(res.status == 200 && res.data.code == '0000'){
	            	let data = res.data.data;
	                this.form.id = data.id;
	                this.form.name = data.name;
	                this.form.category = data.category;
	                this.form.courseName = data.courseName;
	                this.form.courseId = data.courseId;
	                this.form.parentId = data.parentId;
	                this.form.seq = data.seq;
	                this.form.shelfStatus = data.shelfStatus;
	                this.form.remarks = data.remarks;
	                this.shelfStatusName = data.shelfStatusName;
            	}
            })
        },
        methods: {
        	// 保存编辑
            saveEdit() {
            	if(this.isDisable){
            		this.isDisable = false;
            		this.$axios.post("app/knowledgeTree/update",
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