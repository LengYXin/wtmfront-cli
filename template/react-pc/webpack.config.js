const webpack = require('./config/webpack.config');
module.exports = webpack(__dirname, 8100, {
    '/server': {
        target: 'http://localhost:8765',
        pathRewrite: {
            "^/server": ""
        },
        secure: false,
        changeOrigin: true,
        logLevel: "debug"
    },
    '/api': {
        target: 'http://10.120.112.126:8007',
        pathRewrite: {
            "^/api": ""
        },
        secure: false,
        changeOrigin: true,
        logLevel: "debug"
    },
})