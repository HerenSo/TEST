module.exports = {
    baseUrl: process.env.NODE_ENV === "production" ? "/shihe-bank/" : "./",
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
//              target:'http://jsonplaceholder.typicode.com',
				target:'http://39.98.209.34/shihe-bank',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    }
}