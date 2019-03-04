<template>
	<div class="container">
		<div class="form-box">
			<el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	        	<el-row :gutter="20">
	        		<el-col :span="12">
		                <el-form-item label="体系名称">
		                    <el-input v-model="form.contentName" readonly></el-input>
		                </el-form-item>
	               </el-col>
	        		<el-col :span="12">
	                <el-form-item label="体系类型">
	                    <el-input v-model="form.typeName"></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="学科">
	                    	<el-input v-model="form.courseName" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="科类">
	                	<el-input v-model="form.categoryName" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="年级">
	                    	<el-input v-model="form.gradeName" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="归属人">
	                	<el-input v-model="form.owner" readonly></el-input>
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
	                <el-form-item label="创建人">
	                    <el-input v-model="form.creator" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="创建时间">
	                    <el-input v-model="form.createTime" readonly></el-input>
	                </el-form-item>
	               </el-col>
	        		<el-col :span="12">
	                <el-form-item label="审核人">
	                    <el-input v-model="form.auditor" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="审核时间">
	                    <el-input v-model="form.auditTime" readonly></el-input>
	                </el-form-item>
	              </el-col>
	            </el-row>
	        </el-form>
	        <div class="text-center" v-if="ischeck">
		        <span slot="footer" class="dialog-footer">
		            <el-button type="primary" @click="checkpass(15)" v-if="ischeckpass" class="m-r-10">审核不通过</el-button>
		            <el-button type="primary" @click="checkpass(10)" v-else class="m-r-10">审核通过</el-button>
		            <router-link to='elementCheck' ><el-button >取 消</el-button></router-link>
		        </span>
	        </div>
	        <div class="text-center" v-if="isput">
		        <span slot="footer" class="dialog-footer">
		            <el-button type="primary" @click="putpass(5)" v-if="isputpass" class="m-r-10">下架</el-button>
		            <el-button type="primary" @click="putpass(10)" v-else  class="m-r-10">上架</el-button>
		            <router-link to='elementCheck' ><el-button >取 消</el-button></router-link>
		        </span>
	        </div>
	        <div class="text-center" v-else>
		        <span slot="footer" class="dialog-footer">
		            <router-link to='elementCheck' v-if="fromCheck"><el-button >返回</el-button></router-link>
		            <router-link to='elementManage' v-else><el-button >返回</el-button></router-link>
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
                form: {},
                fromCheck: false,
                ischeck: null,
                ischeckpass: null,
                isput: null,
                isputpass: null,
                msg: "",
                isDisable: true
            }
        },
        created(){
        	this.form.id = this.$route.query.id;
//      	console.log("type="+this.$route.query.type)
			if(this.$route.query.type == 1){
        		this.fromCheck = true;
        	}
        	if(this.$route.query.type == 2){
        		this.ischeck = true;
        	}
        	if(this.$route.query.type == 3){
        		this.isput = true;
        	}
//       	console.log(this.form.id)
        },
        mounted() {
         	this.$axios.get("app/architectureTree/get",{
                params:{
	    			"id": this.form.id
	    		}
            }).then((res) => {
            	if(res.status == 200 && res.data.code == '0000'){
	                this.form = res.data.data;
	                let knowledgesNamelist = [];
	                for(var i=0;i<this.form.knowledges.length;i++){
	                	knowledgesNamelist.push(this.form.knowledges[i].knowledgeName);
	                }
	                this.form.knowledgesName = knowledgesNamelist.join(",");
	                if(this.form.auditStatus == '10'){
	                	this.ischeckpass = true;
	                }else{
	                	this.ischeckpass = false;
	                }
	                if(this.form.shelfStatus == '10'){
	                	this.isputpass = true;
	                }else{
	                	this.isputpass = false;
	                }
	            	// console.log(this.form)
            	}
            })
        },
        methods: {
        	putpass(val) {
        		if(this.isDisable){
            		this.isDisable = false;
	        		this.$axios.post("app/knowledgeTree/shelf",{
		    			"id": this.form.id,
		    			"shelfStatus": val
		            }).then((res) => {
		            	if(res.status == 200 && res.data.code == '0000'){
		            		if(res.data.data.shelfStatus == 10){
		            			this.msg = "上架成功！";
		            		}
		            		if(res.data.data.shelfStatus == 5){
		            			this.msg = "下架成功！";
		            		}
							this.$message({
					          message: this.msg,
					          type: 'success',
					          onClose:function(){
					          	router.push('/systemType');
					          }
					        });
		            	}else{
		            		this.isDisable = true;
		            	}
		            })
	            }
        	},
        	checkpass(val) {
        		if(this.isDisable){
            		this.isDisable = false;
	        		this.$axios.post("app/architectureTree/audit",{
			    			"id": this.form.id,
			    			"auditStatus": val
		            }).then((res) => {
		            	if(res.status == 200 && res.data.code == '0000'){
		            		if(res.data.data.auditStatus == 10){
		            			this.msg = "审核成功通过！";
		            		}
		            		if(res.data.data.auditStatus == 15){
		            			this.msg = "成功取消审核通过！";
		            		}
							this.$message({
					          message: this.msg,
					          type: 'success',
					          onClose:function(){
					          	router.push('/systemType');
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