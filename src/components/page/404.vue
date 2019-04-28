<template>
  <div class="error-page">
  	  	
		<div id="casePourpre">
		  <div id="load">
		    <p>啊哦~ 功能开发中</p>
		  </div>
		  <div id="vague">
		    <div id="vague1"></div>
		    <div id="vague2"></div>
		    <div id="vague3"></div>
		    <div id="vague4"></div>
		    <div id="vague5"></div>
		    <div id="vague6"></div>
		    <div id="vague7"></div>
		    <div id="vague8"></div>
		    <div id="vague9"></div>
		    <div id="vague10"></div>
		  </div>
		</div>
      <!--<div class="error-code">4<span>0</span>4</div>
      <div class="error-desc">啊哦~ 你所访问的页面不存在</div>
      <div class="error-handle">
          <router-link to="/">
            <el-button type="primary" size="large">返回首页</el-button>
          </router-link>
          <el-button class="error-btn" type="primary" size="large" @click="goBack">返回上一页</el-button>
      </div>-->
  </div>
</template>

<script>
export default {
  methods: {
      goBack(){
          this.$router.go(-1);
      }
  }
}
</script>


<style scoped>
    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
    }
    .error-code{
        line-height: 1;
        font-size: 250px;
        font-weight: bolder;
        color: #2d8cf0;
    }
    .error-code span{
        color: #00a854;
    }
    .error-desc{
        font-size: 30px;
        color: #777;
    }
    .error-handle{
        margin-top: 30px;
        padding-bottom: 200px;
    }
    .error-btn{
        margin-left: 100px;
    }
    /****DEBUT VAGUE****/
   	#casePourpre {
		  /*background-color : #422c83;*/
		  height : 140px;
		  width : 360px;
		  padding-top : 10px;
		  float : left;
		  position : relative;
		  top:-100px;
		}
		#casePourpre #load {
		  color : #66b1ff;
		  font-family : calibri;
		  text-align : center;
		  position : absolute;
		  top : 20px;
		  left :54px;
		}
		#casePourpre #load p{
			font-size: 24px;
		}
		#vague {
		  position : absolute;
		  top : 72px;
		  left : 20px;
		}
		#vague > div{
			margin: 6px;
		}
		
		#vague1 {
		  height : 10px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague1 4.5s infinite;
		  -webkit-animation : vague1 4.5s infinite;
		}
		
		@-webkit-keyframes vague1 {
		  0% {height : 5px;}
		  50% {height : 60px;}
		  100% {height : 5px;}
		}
		
		@keyframes vague1 {
		  0% {height : 10px;}
		  50% {height : 60px;}
		  100% {height : 10px;}
		}
		
		#vague2 {
		  height : 10px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague2 4.5s infinite;
		  -webkit-animation : vague2 4.5s infinite;
		  animation-delay : 0.5s;
		  -webkit-animation-delay : 0.5s;
		}
		
		@-webkit-keyframes vague2 {
		  0% {height : 10px;}
		  50% {height : 60px;}
		  100% {height : 10px;}
		}
		
		@keyframes vague2 {
		  0% {height : 10px;}
		  50% {height : 60px;}
		  100% {height : 10px;}
		}
		
		#vague3 {
		  height : 10px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague3 4.5s infinite;
		  -webkit-animation : vague3 4.5s infinite;
		  animation-delay : 1s;
		  -webkit-animation-delay : 1s;
		}
		
		@-webkit-keyframes vague3 {
		  0% {height : 10px;}
		  50% {height : 80px;}
		  100% {height : 10px;}
		}
		
		@keyframes vague3 {
		  0% {height : 10px;}
		  50% {height : 80px;}
		  100% {height : 10px;}
		}
		
		#vague4 {
		  height : 20px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague4 4.5s infinite;
		  -webkit-animation : vague4 4.5s infinite;
		  animation-delay : 1.5s;
		  -webkit-animation-delay : 1.5s;
		}
		
		@-webkit-keyframes vague4 {
		  0% {height : 20px;}
		  50% {height : 80px;}
		  100% {height : 20px;}
		}
		
		@keyframes vague4 {
		  0% {height : 20px;}
		  50% {height : 80px;}
		  100% {height : 20px;}
		}
		
		#vague5 {
		  height : 20px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague5 4.5s infinite;
		  -webkit-animation : vague5 4.5s infinite;
		  animation-delay : 2s;
		  -webkit-animation-delay : 2s;
		}
		
		@-webkit-keyframes vague5 {
		  0% {height : 20px;}
		  50% {height : 80px;}
		  100% {height : 20px;}
		}
		
		@keyframes vague5 {
		  0% {height : 20px;}
		  50% {height : 80px;}
		  100% {height : 20px;}
		}
		
		#vague6 {
		  height : 20px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague6 4.5s infinite;
		  -webkit-animation : vague6 4.5s infinite;
		  animation-delay : 2.5s;
		  -webkit-animation-delay : 2.5s;
		}
		
		@-webkit-keyframes vague6 {
		  0% {height : 20px;}
		  50% {height : 80px;}
		  100% {height : 20px;}
		}
		
		@keyframes vague6 {
		  0% {height : 20px;}
		  50% {height : 80px;}
		  100% {height : 20px;}
		}
		
		#vague7 {
		  height : 10px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague7 4.5s infinite;
		  -webkit-animation : vague7 4.5s infinite;
		  animation-delay : 3s;
		  -webkit-animation-delay : 3s;
		}
		
		@-webkit-keyframes vague7 {
		  0% {height : 10px;}
		  50% {height : 80px;}
		  100% {height : 10px;}
		}
		
		@keyframes vague7 {
		  0% {height : 10px;}
		  50% {height : 80px;}
		  100% {height : 10px;}
		}
		
		#vague8 {
		  height : 10px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague8 4.5s infinite;
		  -webkit-animation : vague8 4.5s infinite;
		  animation-delay : 3.5s;
		  -webkit-animation-delay : 3.5s;
		}
		
		@-webkit-keyframes vague8 {
		  0% {height : 10px;}
		  50% {height : 80px;}
		  100% {height : 10px;}
		}
		
		@keyframes vague8 {
		  0% {height : 10px;}
		  50% {height : 80px;}
		  100% {height : 10px;}
		}
		
		#vague9 {
		  height : 10px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague9 4.5s infinite;
		  -webkit-animation : vague9 4.5s infinite;
		  animation-delay : 4s;
		  -webkit-animation-delay : 4s;
		}
		
		@-webkit-keyframes vague9 {
		  0% {height : 10px;}
		  50% {height : 60px;}
		  100% {height : 10px;}
		}
		
		@keyframes vague9 {
		  0% {height : 10px;}
		  50% {height : 60px;}
		  100% {height : 10px;}
		}
		
		#vague10 {
		  height : 10px;
		  width : 12px;
		  background-color : #66b1ff;
		  float : left;
		  animation : vague10 4.5s infinite;
		  -webkit-animation : vague10 4.5s infinite;
		  animation-delay : 4.5s;
		  -webkit-animation-delay : 4.5s;
		}
		
		@-webkit-keyframes vague10 {
		  0% {height : 10px;}
		  50% {height : 60px;}
		  100% {height : 10px;}
		}
		
		@keyframes vague10 {
		  0% {height : 10px;}
		  50% {height : 60px;}
		  100% {height : 10px;}
		}
		/****FIN VAGUE****/
</style>
