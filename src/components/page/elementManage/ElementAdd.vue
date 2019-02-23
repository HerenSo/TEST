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
                <el-form-item label="体系类型">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
               	</el-col>
        		<el-col :span="12">
                <el-form-item label="学科" required>
                    <el-input v-model="form.course"></el-input>
                    <el-input v-model="form.courseId" class="hidden"></el-input>
                    <el-input v-model="form.parentId" class="hidden"></el-input>
                </el-form-item>
               	</el-col>
        		<el-col :span="12" required>
                <el-form-item label="科类" prop="category">
                	<el-select v-model="form.category" placeholder="请选择科类">
				      <el-option label="普文" value=""></el-option>
				      <el-option label="普理" value=""></el-option>
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
                    <el-input v-model="form.shelfStatus"></el-input>
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
	export default{
		name: "systemTable",
		data() {
            return {
                form: {
                    "name": '', // 知识元名称
					"category": '', // 学科类别
					"courseId": '', //学科ID
					"parentId": '', // 父节点ID,顶级传0
					"seq": '', // 排序
					"shelfStatus": '', //上架状态
					"remarks": '' //备注
                },
                rules: {
		          name: [
		            { required: true, message: '请输入知识元名称', trigger: 'blur' }
		          ],
		          category: [
		            { required: true, message: '请选择学科类别', trigger: 'change' }
		          ],
	            }
            }
        },
        methods: {
        	// 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            }
       }
   }
</script>

<style>
</style>