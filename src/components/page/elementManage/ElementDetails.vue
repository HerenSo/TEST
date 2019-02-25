<template>
	<div class="container">
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	        	<el-row :gutter="20">
	        		<el-col :span="12">
		                <el-form-item label="知识元名称">
		                    <el-input v-model="form.name" readonly></el-input>
		                </el-form-item>
	               	</el-col>
	        		<!--<el-col :span="12">
	                <el-form-item label="体系类型">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>-->
	        		<el-col :span="12">
	                <el-form-item label="学科">
	                    <el-input v-model="form.courseName" readonly></el-input>
	                    <el-input v-model="form.courseId" class="hidden"></el-input>
	                    <el-input v-model="form.parentId" class="hidden"></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="科类">
	                	<el-input v-model="form.category" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<!--<el-col :span="12">
	                <el-form-item label="审核状态">
	                    <el-input v-model="form.address"></el-input>
	                </el-form-item>
	               	</el-col>-->
	        		<el-col :span="12">
	                <el-form-item label="审核状态">
	                    <el-input v-model="form.auditStatusName" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="上架状态">
	                    <el-input v-model="form.shelfStatusName" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="创建人">
	                    <el-input v-model="form.creator" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="创建日期">
	                    <el-input v-model="form.createTime" readonly></el-input>
	                </el-form-item>
	               </el-col>
	        		<el-col :span="12">
	                <el-form-item label="排序">
	                    <el-input v-model="form.seq" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	               	<el-col :span="24">
	               	<el-form-item label="备注">
					    <el-input type="textarea" v-model="form.remarks" readonly></el-input>
					</el-form-item>
					</el-col>
	            </el-row>
	        </el-form>
	        <div class="text-center" v-if="ischeck">
		        <span slot="footer" class="dialog-footer">
		            <el-button type="primary" @click="" class="m-r-10">审核通过</el-button>
		            <router-link to='elementManage' ><el-button >取 消</el-button></router-link>
		        </span>
	        </div>
	        <div class="text-center" v-if="isput">
		        <span slot="footer" class="dialog-footer">
		            <el-button type="primary" @click="" class="m-r-10">上架</el-button>
		            <router-link to='elementManage' ><el-button >取 消</el-button></router-link>
		        </span>
	        </div>
        </div>
    </div>
</template>

<script>
    import bus from '../../common/bus';
	import router from '@/router';
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
                ischeck: null,
                isput: null
            }
        },
        created(){
        	this.form.id = this.$route.query.id;
        	console.log("type="+this.$route.query.type)
        	if(this.$route.query.type == 2){
        		this.ischeck = true;
        	}
        	if(this.$route.query.type == 3){
        		this.isput = true;
        	}
         	console.log(this.form.id)
        },
        mounted() {
         	this.$axios.get("/api/app/knowledgeTree/get",{
                params:{
	    			"id": this.form.id
	    		}
            }).then((res) => {
            	if(res.status == 200 && res.data.code == '0000'){
	                this.form = res.data.data;
	            	// console.log(this.form)
            	}
            })
        }
   }
</script>

<style>
</style>