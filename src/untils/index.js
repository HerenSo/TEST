import axios from './http'

var depot = {}

depot.get = function ({ url, data, cb }) {
    axios.get(url, {params:data}).then((res) => {
    	console.log(data+"__________-")
        if (res.status === 200) {
//          let result = res.data;
            cb(JSON.parse(JSON.stringify(res.data)));
//          console.log(res.data)
        }
    }).catch((error) => {
    	console.log(url+"__________-")
        console.log('请求错误：' + error);
    });
};

depot.post = function ({ url, params, cb }) {
    axios.post(url, params).then(
        (res) => {
            if (res.status === 200) {
                if (res.status === 200) {
                    let result = res.data;
                    cb(result);
                }
            }
        }).catch((error) => {
        console.log(error);
    });
};

export default () => {
    window.depot = depot;
};