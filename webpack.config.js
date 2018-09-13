const webpack = require('./config/webpack.config');
const wtmfront = require('./wtmfront.json');
const config = {
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
};
module.exports = webpack(evn => {
    return {
        __dirname: __dirname,
        port: 8100,
        proxy: {
            /**
             * 脚手架服务器地址
             */
            '/server': {
                target: 'http://localhost:8765',
                pathRewrite: {
                    "^/server": ""
                },
                ...config
            },
            /**
             * 
             */
            '/swaggerDoc': {
                target: wtmfront.swaggerDoc,
                pathRewrite: {
                    "^/swaggerDoc": ""
                },
                ...config
            },
            '/api': {
                target: wtmfront.api,
                pathRewrite: {
                    "^/api": ""
                },
                ...config
            },
        },
        deployWrite: `
        
        `,
        // 字符串写入 需要 使用 JSON.stringify 转换
        DefinePlugin: {
            // APIADDRESS: JSON.stringify(env.type == "deploy" ? "http://api.tjise.edudot.cn" : "http://api.tjise.stonemonth.com"),
        }
    }
})