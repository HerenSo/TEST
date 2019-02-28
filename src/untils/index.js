import Vue from 'vue'
import axios from 'axios';
import { Message } from 'element-ui';
Vue.prototype.$axios = axios;
let auditStatus = [];

axios.get("app/combobox/auditStatus/list",{
	headers:{
		tokenId: localStorage.getItem("userToken")
	}
}).then((res) => {
	if(res.status=="200" && res.data.code == '0000'){
		auditStatus = res.data.data;
		
	}
}).catch(error => {
  	Message({
      message: error,
      type: 'warning'
    });
});
const MyPlugin = {
    // install方法是必需的
	// 包含两个参数：Vue 构造器，一个可选的选项对象
    install(Vue, options) {
        Vue.prototype.test = auditStatus ;
        Vue.prototype.wechat =  "my wechat!";
 
    }
};
export default MyPlugin