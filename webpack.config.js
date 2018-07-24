const webpack = require('./config/webpack.config');
const wtmfront = require('./wtmfront.json');
const config={ 
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
};
module.exports = webpack(__dirname, 8100, {
    '/server': {
        target: 'http://localhost:8765',
        pathRewrite: {
            "^/server": ""
        },
       ...config
    },
    '/swagger': {
        target: wtmfront.swagger,
        pathRewrite: {
            "^/swagger": ""
        },
        ...config
    },
    '/api': {
        target: wtmfront.swagger,
        pathRewrite: {
            "^/api": ""
        },
        ...config
    },
})