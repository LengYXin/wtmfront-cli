const deploy = require("./webpack.deploy");
const dev = require("./webpack.dev");
module.exports = (params) => {
    return (env = {}) => {
        // 参数为函数 执行 函数 获取返回参数
        if (typeof params == "function") {
            params = params(env);
        }
        switch (env.type) {
            case 'deploy':
                return deploy(params);
            default:
                return dev(params);
        }
    }
}