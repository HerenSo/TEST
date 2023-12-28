module.exports = {
    baseUrl: process.env.NODE_ENV === "production" ? "/shihe-bank/" : "./",
    productionSourceMap: false,
    devServer: {
        port: 8100,
        open: true, //项目运行成功后是否直接打开浏览器
		https:false,
        proxy: 'http://bank.shihe.site/shihe-bank',
        // proxy: 'http://39.98.209.34/shihe-bank',
    }
}
// console.log("当前环境:",process.env.NODE_ENV)