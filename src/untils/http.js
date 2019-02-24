import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui';
// 路由请求拦截
// http request 拦截器
axios.interceptors.request.use(
  config => {
    //config.data = JSON.stringify(config.data);  
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    //判断是否存在ticket，如果存在的话，则每个http header都加上ticket
    if (localStorage.getItem("userToken")) {
        //用户每次操作，都将cookie设置成2小时
//      cookie.set("token",cookie.get("token") ,1/12)    
　　　　       config.headers.tokenId = localStorage.getItem("userToken");
    }
    
    return config;
  },
  error => {
    return Promise.reject(error.response);
  });

// 路由响应拦截
// http response 拦截器
axios.interceptors.response.use(
  response => {
  	if (response.status === 200) {
  		if (response.data.code == '0000'){
	        return response;
  		}else if (response.data.code == '1002' || response.data.code == '9001') {
  			console.log(response.data.code);
	        Message({
	          message: response.data.msg,
	          type: 'warning',
//	          showClose: true,
//	          duration: 20000,
	          onClose: function(){
	            router.push('/login');
	          }
	        });
	        return
	    }else{
			Message({
	          message: response.data.msg || "请求错误!",
	          type: 'warning'
	        });
	        return
	    }
    }
  },
  error => {
  	console.log(error.response)
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  });
export default axios;
