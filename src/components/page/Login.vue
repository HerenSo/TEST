<template>
    <div class="login-wrap">
        <div class="ms-login">
            <!--<div class="ms-title">后台管理系统</div>-->
            <div class="ms-title"><img src="../../assets/img/logo.jpg" />侍禾试题库后台管理</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input type="text" v-model="ruleForm.loginId" placeholder="请输入用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="pass">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.loginPass">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                	<el-col :span="16">
	                    <el-input type="text" placeholder="请输入验证码" v-model="ruleForm.code" >
	                    </el-input>
                   	</el-col>
                   	<el-col :span="7" class="code">
                    	<img :src="codeUrl" @click.prevent="codeRefresh()" />
                    </el-col>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!--<p class="login-tips">Tips : 用户名和密码随便填。</p>-->
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    "loginId": '',
                    "loginPass": '',
                    "code": ''
                },
                rules: {
                    loginId: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    loginPass: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                },
                userToken: '',
                userName: "",
                codeUrl:'app/captcha'
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                	let _this = this;
//              	console.log(JSON.stringify(this.ruleForm));
                    if (valid) {
                    	this.$axios.post('app/login',this.ruleForm
				        ).then(res => {
				          console.log(res.data);
//				          alert('登陆成功');
				          this.userToken = res.data.data.tokenId;
				          this.userName = res.data.data.userName;
				          localStorage.setItem("userToken",this.userToken);
				          localStorage.setItem("ms_username",this.userName);
				          localStorage.setItem("ms_rights",JSON.stringify(res.data.data.rights));
//				          // 将用户token保存到vuex中
//				          _this.changeLogin({ Authorization: _this.userToken });
				          _this.$router.push('/elementManage');
				        }).catch(error => {
//				          alert('账号或密码错误');
				          console.log(error);
				        });
                    } else {
                        cuanonsole.log('error submit!!');
                        return false;
                    }
                });
            },
            codeRefresh() {
//          	this.codeUrl = "http://39.98.209.34/shihe-bank/app/captcha?"+Math.random();
            	this.codeUrl = "app/captcha";
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
    	background: #fff;
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size: 28px;
    	color: #f7fafd;
        border-bottom: 1px solid #ddd;
        text-shadow: -2px 2px 3px #032d58;;
	    font-weight: bold;
	    /* letter-spacing: 1px; */
	    font-family: KaiTi;
    }
    .ms-title img{
    	width: 50px;
    	vertical-align: -25px;
    	padding: 10px 0;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        background: #fff;
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    .code{
    	text-align: center;
    	background: #fff;
    	vertical-align: middle;
    	border-radius: 4px;
    	border: 1px solid #dcdfe6;
    	line-height: 31px;
    	float: right;
    }
    .code img{
    	width: 100%;
    	vertical-align: middle;
    }
</style>