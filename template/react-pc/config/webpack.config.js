const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');//模板
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理
const CopyWebpackPlugin = require('copy-webpack-plugin');//拷贝
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css
const tsImportPluginFactory = require('ts-import-plugin');//按需导入
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const rootDir = path.dirname(__dirname);
module.exports = (__dirname, port = 8000, proxy = {}) => {
    // return console.log('路径-',path.resolve(rootDir,'model/index.ts') );
    const pathName = path.basename(__dirname);
    // const outputPaht = path.resolve(rootDir, "build", pathName);
    const outputPaht = path.resolve(rootDir, "build");
    // 打包时间戳
    const time = +new Date();
    // 分离css
    const styleCss = new MiniCssExtractPlugin({
        filename: `css/style.css?t=${time}`,
        // chunkFilename: "css/[id].css"
    });
    // 源代码根路径
    const srcPath = path.resolve(__dirname, "src");
    // 插件
    let plugins = [

        new CopyWebpackPlugin([{
            from: 'src/assets',
            to: 'assets'
        }]),
        styleCss
    ];
    return (evn = {}) => {
        evn.Generative = evn.Generative == "true"
        console.log(`-------------------------------------- ${evn.Generative ? '生产' : '开发'} ${evn.Dev}  --------------------------------------`);
        plugins = [
            // 把生成的文件插入到 启动页中
            new HtmlWebpackPlugin({
                template: './src/index.html', options: {
                    minimize: true,
                },
                // 测试环境  加入 vconsole
                //         vconsole: evn.Dev == 'beta' ? `<script src="./assets/vconsole.min.js"></script>
                // <script> if (window.location.hostname !== "localhost") { var vConsole = new VConsole(); }</script>`: ''
            }),
            ...plugins
        ]
        // 生产环境 添加需要的插件
        if (evn.Generative) {
            plugins = [
                // new webpack.DefinePlugin({
                //     "process.env": {
                //         NODE_ENV: JSON.stringify("production")
                //     }
                // }),
                // 清理目录
                // new CleanWebpackPlugin([pathName], { root: path.resolve(rootDir, "build") }),
                new CleanWebpackPlugin([outputPaht], { root: rootDir }),
                ...plugins
            ]
        }
        const Config = {
            entry: {
                'app': './src/index.tsx' //应用程序
            },
            output: {
                path: outputPaht,
                publicPath: evn.Generative ? './' : '/',
                filename: `js/[name].js?t=${time}`,
                chunkFilename: `js/[name].js?t=${time}`
            },
            devServer: {
                inline: true, //热更新
                port: port,
                compress: true,//为服务的所有内容启用gzip压缩：
                // hotOnly: true,//在构建失败的情况下启用无需刷新页面作为回退的热模块替换
                // lazy: true,//懒惰模式
                overlay: true,//显示错误
                proxy: {
                    ...proxy
                },
                //404 页面返回 index.html 
                historyApiFallback: true,
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"],
                // 模块别名
                alias: {
                    "app": path.resolve(rootDir, 'src', 'app'),
                    "assets": path.resolve(rootDir, 'src', 'assets'),
                    "components": path.resolve(rootDir, 'src', 'components'),
                    "containers": path.resolve(rootDir, 'src', 'containers'),
                    "store": path.resolve(rootDir, 'src', 'store'),
                    "utils": path.resolve(rootDir, 'src', 'utils')
                }
            },
            module: {
                rules: [
                    {
                        test: /\.(tsx|ts|js|jsx)$/,
                        loader: 'awesome-typescript-loader',
                        options: {
                            // 按需加载 ts 文件
                            getCustomTransformers: () => ({
                                before: [tsImportPluginFactory([{
                                    libraryDirectory: '../_esm2015/operators',
                                    libraryName: 'rxjs/operators',
                                    style: false,
                                    camel2DashComponentName: false,
                                    transformToDefaultImport: false
                                }, { libraryName: 'antd', style: false }
                                ])]
                            }),
                        },
                        exclude: /node_modules/
                    },
                    {
                        test: /\.(less|css)$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            `css-loader?sourceMap=true&minimize=${evn.Generative}`,
                            {
                                loader: 'postcss-loader', options: {
                                    ident: 'postcss',
                                    sourceMap: true,
                                    plugins: (loader) => [
                                        require('autoprefixer')({
                                            browsers: [
                                                // 加这个后可以出现额外的兼容性前缀
                                                "> 0.01%"
                                            ]
                                        }),
                                    ]
                                }
                            },
                            `less-loader?sourceMap=true&javascriptEnabled=true`
                        ]
                    },
                    {
                        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                        loader: 'url-loader?limit=50000&name=[path][name].[ext]'
                    },

                ]
            },

        };
        return [{
            ...Config,

            // 打包模式 development。启用NamedModulesPlugin。 production。启用UglifyJsPlugin，ModuleConcatenationPlugin和NoEmitOnErrorsPlugin。
            mode: evn.Generative ? 'production' : 'development',
            // mode: 'development',
            // 开发环境 生成 map 文件  
            devtool: evn.Generative ? false : 'source-map',
            // webpack 4删除了CommonsChunkPlugin，以支持两个新选项（optimization.splitChunks和optimization.runtimeChunk）
            // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
            optimization: {
                minimizer: [
                    new UglifyJsPlugin({
                        parallel: true,
                        uglifyOptions: {
                            compress: {
                                drop_console: evn.Dev == 'build'
                            }
                        }
                    })
                ]
                ,
                splitChunks: {
                    cacheGroups: {
                        commons: {
                            test: /[\\/]node_modules[\\/]/,
                            name: "vendors",
                            chunks: "all"
                        },
                    },
                }
            },
            plugins,
        }
        ]
    }
}