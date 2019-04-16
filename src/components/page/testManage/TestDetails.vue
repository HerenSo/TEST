<template>
	<div class="container">
		<div class="p-40">
			<el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	        	<el-row :gutter="20">
	        		<el-col :span="24">
		                <label>试题题干:</label>
		                <div class="test_dethtml" v-html="form.questionHtml?form.questionHtml:'暂无'"></div>
	               	</el-col>
	        		<el-col :span="24">
		                <label>答案:</label>
		                <div class="test_dethtml" v-html="form.answerHtml?form.answerHtml:'暂无'"></div>
	               	</el-col>
	        		<el-col :span="24">
		                <label>解析:</label>
		                <div class="test_dethtml" v-html="form.analysisHtml?form.analysisHtml:'暂无'"></div>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="资源编号">
	                    <el-input v-model="form.resourceNo" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="学科">
	                    <el-input v-model="form.courseName" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="区域">
	                    <el-input v-model="form.region" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="科类">
	                	<el-input v-model="form.category" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="题型">
	                	<el-input v-model="form.questionTypeName" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="年份">
	                	<el-input v-model="form.year" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="难度系数">
	                	<el-input v-model="form.year" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
		                <el-form-item label="知识元名称">
		                	<el-tooltip class="item" effect="light" :content="form.knowledgesName" placement="right">
		                    	<el-input v-model="form.knowledgesName" readonly></el-input>
    						</el-tooltip>
		                </el-form-item>
	                </el-col>
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
	                <el-form-item label="修改人">
	                    <el-input v-model="form.updater" readonly></el-input>
	                </el-form-item>
	               	</el-col>
	        		<el-col :span="12">
	                <el-form-item label="修改日期">
	                    <el-input v-model="form.updateTime" readonly></el-input>
	                </el-form-item>
	                </el-col>
	        		<el-col :span="12" class="remarks">
	                <el-form-item label="备注">
	                    <el-input type="textarea" v-model="form.remarks" readonly></el-input>
	                </el-form-item>
	                </el-col>
	            </el-row>
	        </el-form>
	        <div class="text-center" >
		        <span slot="footer" class="dialog-footer" v-if="ischeck">
		            <el-button type="danger" @click="checkpass(15)" v-if="ischeckpass" class="m-r-10">审核不通过</el-button>
		            <el-button type="primary" @click="checkpass(10)" v-if="!ischeckpass" class="m-r-10">审核通过</el-button>
		        </span>
		        <span slot="footer" class="dialog-footer" v-if="isput">
		            <el-button type="danger" @click="putpass(5)" v-if="isputpass" class="m-r-10">下架</el-button>
		            <el-button type="primary" @click="putpass(10)" v-if="!isputpass"  class="m-r-10">上架</el-button>
		        </span>
		        <span slot="footer" class="dialog-footer">
		            <router-link :to='topath'><el-button >返回</el-button></router-link>
		        </span>
	        </div>
        </div>
    </div>
</template>

<script>
    import bus from '../../common/bus';
	import router from '@/router';
	export default{
		name: "testDetails",
		data() {
            return {
                form: {},
                ischeck: false,
                ischeckpass: false,
                isput: false,
                isputpass: false,
                msg: "",
                isDisable: true,
                topath:""
            }
      },
        created(){
        	this.topath = this.$route.query.path; // 获取返回路径
        	
        	// 权限
        	
			let rightName = ''; // 判断权限归属名称
			if(this.topath == "/testManage"){
				rightName = 'question';
			}
			if(this.topath == "/testSystem"){
				rightName = 'questionArchitecture';
			}
			if(this.topath == "/testElement"){
				rightName = 'questionKnowledge';
			}
         	let rights = JSON.parse(localStorage.getItem("ms_rights"));
         	let curRights = rights.filter(function(item){
         		return item.rightId.split(":")[0] == rightName;
         	})
         	let that = this;
         	curRights.forEach(function(item){ // 权限处理
         		switch(item.rightId.split(":")[1]){
         			case "shelf":that.isput = true; // 上架
         			break;
         			case "audit":that.ischeck = true; // 审核
         			break;
         			default:break;
         		}
         	})
        	this.form.id = this.$route.query.id;
        	console.log(this.isput)
//       	console.log(this.form.id)
        },
        mounted() {
         	this.$axios.get("app/question/message/get",{
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
	                this.form.remarks = this.form.remarks ? this.form.remarks : ''; // 后台暂未有备注字段，需判断
	                this.form.knowledgesName = knowledgesNamelist.join(",");
//	                console.log(this.form.knowledgesName);
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
	        		this.$axios.post("app/question/message/shelf",{
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
		            		let topath = this.topath;
							this.$message({
					          message: this.msg,
					          type: 'success',
					          onClose:function(){
					          	router.push(topath);
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
	        		this.$axios.post("app/question/message/audit",{
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
		            		let topath = this.topath;
							this.$message({
					          message: this.msg,
					          type: 'success',
					          onClose:function(){
					          	router.push(topath);
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

<style scoped="scoped">
	.el-col.el-col-12{
		height: 50px;
	}
	.el-col.el-col-12.remarks{
		height: auto;
	}
	.test_dethtml{
		margin-bottom: 20px;
	}
</style>