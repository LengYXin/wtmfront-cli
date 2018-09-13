const webpack = require('webpack');
const path = require('path');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');//模板
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理
const CopyWebpackPlugin = require('copy-webpack-plugin');//拷贝
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css
const tsImportPluginFactory = require('ts-import-plugin');//按需导入
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")
const rootDir = path.dirname(__dirname);
const time = moment().format('YYYY-MM-DD HH:mm:ss');
module.exports = (params) => {
    const {
        entry,
        output,
        devServer,
        resolve,
        module,
        mode,
        devtool,
        optimization,//优化选项
        plugins = [],//插件
        deployWrite = "",//模板写入内容
        DefinePlugin = {}//写入变量
    } = params;

    const config = {
        entry: {
            'app': './src/index.tsx' //应用程序
        },
        output: {
            // 无出口路径使用编译时间戳
            path: path.resolve(rootDir, "build", time.valueOf()),
            publicPath: '/',
            filename: `js/[name].js`,
            chunkFilename: `js/[name].js`,
            ...output
        },
        devServer: {
            inline: true, //热更新
            port: 8000,
            compress: true,//为服务的所有内容启用gzip压缩：
            // hotOnly: true,//在构建失败的情况下启用无需刷新页面作为回退的热模块替换
            // lazy: true,//懒惰模式
            overlay: true,//显示错误
            // host: '0.0.0.0',
            // useLocalIp: true,
            host: '127.0.0.1',
            proxy: {

            },
            //404 页面返回 index.html 
            historyApiFallback: true,
            ...devServer,
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
            // 模块别名
            alias: {
                "app": path.resolve(rootDir, 'src', 'app'),
                "assets": path.resolve(rootDir, 'src', 'assets'),
                "components": path.resolve(rootDir, 'src', 'components'),
                "containers": path.resolve(rootDir, 'src', 'containers'),
                "core": path.resolve(rootDir, 'src', 'core'),
                "store": path.resolve(rootDir, 'src', 'store'),
                "utils": path.resolve(rootDir, 'src', 'utils'),
                "wtmfront.json": path.resolve(rootDir, "wtmfront.json")
            },
            ...resolve,
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|ts|js|jsx)$/,
                    loader: 'awesome-typescript-loader',
                    options: {
                        // 按需加载 ts 文件
                        getCustomTransformers: () => ({
                            before: [tsImportPluginFactory([
                                {
                                    libraryDirectory: '../_esm2015/operators',
                                    libraryName: 'rxjs/operators',
                                    style: false,
                                    camel2DashComponentName: false,
                                    transformToDefaultImport: false
                                },
                                { libraryName: 'antd', style: false },
                                {
                                    libraryName: 'ant-design-pro',
                                    libraryDirectory: 'lib',
                                    style: true,
                                    camel2DashComponentName: false,
                                }
                            ])]
                        }),
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.(less|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        `css-loader?sourceMap=true&minimize=true`,
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
                    use: [
                        'url-loader?limit=50000&name=[path][name].[ext]',
                        'image-webpack-loader',
                    ]
                },
            ],
            ...module,
        },
        //  development。启用NamedModulesPlugin。 production。启用UglifyJsPlugin，ModuleConcatenationPlugin和NoEmitOnErrorsPlugin。
        mode: mode || 'development',
        //  map   
        devtool: devtool == null ? 'source-map' : devtool,
        // webpack 4删除了CommonsChunkPlugin，以支持两个新选项（optimization.splitChunks和optimization.runtimeChunk）
        // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                    uglifyOptions: {
                        compress: {
                            drop_console: false
                        }
                    }
                })
            ],
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all"
                    }
                },
            },
            ...optimization,
        },
        plugins: [
            new webpack.DefinePlugin({
                // 生成环境？
                PRODUCTION: false,
                ...DefinePlugin
            }),
            new CopyWebpackPlugin([{
                from: 'src/assets',
                to: 'assets',
                ignore: ['icon/**']
            }, {
                from: 'src/index.manifest',
            }]),
            new MiniCssExtractPlugin({
                filename: `css/style.css`,
                chunkFilename: "css/vendors-[id].css"
            }),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                hash: true,
                minify: true,
                vconsole: `
        <!--              Q&A @冷颖鑫 (lengyingxin8966@gmail.com)          -->   
        <!--              Build Time： ${time}   ( *¯ ꒳¯*)!!              -->
                `
            }),
            ...plugins,
        ],
    };
    return config
}