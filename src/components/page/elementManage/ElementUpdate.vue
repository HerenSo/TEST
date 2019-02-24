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
                    <el-input v-model="form.courseName" :disabled="true"></el-input>
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
        		<!--<el-col :span="12">
                <el-form-item label="审核状态">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
               	</el-col>-->
        		<el-col :span="12">
                <el-form-item label="上架状态">
                    <el-input v-model="form.shelfStatus" :disabled="true"></el-input>
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
	            <el-button type="primary" @click="saveEdit">确 定</el-button>
	        </span>
        </div>
        </div>
    </div>
</template>

<script>
    import bus from '../../common/bus';
	export default{
		name: "systemTable",
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
	            }
            }
        },
        created(){
        	this.form.id = this.$route.query.id;
         	console.log(this.form.id)
        },
        mounted() {
        	
         	this.$axios.get("/api/app/knowledgeTree/get",{
                params:{
	    			"id": this.form.id
	    		}
            }).then((res) => {
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
            	console.log(this.form)
            })
        },
        methods: {
        	// 保存编辑
            saveEdit() {
            	this.$axios.post("/api/app/knowledgeTree/update",
	                this.form
	            ).then((res) => {
	            	this.$message({
			          message: "提交成功",
			          type: 'success'
			        });
	            })
            }
       }
   }
</script>

<style>
</style>