const webpack = require('webpack');
const path = require('path');
const rootDir = path.dirname(__dirname);
const basicConfig = require("./basics.confit");
module.exports = (params) => {
    const { __dirname, port = 8000, proxy = {}, deployWrite = "", DefinePlugin } = params;
    const pathName = path.basename(__dirname);
    const outputPaht = path.resolve(rootDir, "build", pathName);
    console.log(`-------------------------------------- 'devServer' --------------------------------------`);
    return [basicConfig({
        output: {
            path: outputPaht,
        },
        plugins: [

        ],
        devServer: {
            port: port,
            proxy: proxy,
        },
        DefinePlugin: {
            ...DefinePlugin
        }
    })]
}