# 目录介绍

``` bash
    |-- config                                                  webpack 配置文件
    |   |-- basics.confit.js                                    基础配置
    |   |-- webpack.config.js                                   webpack跳转入口
    |   |-- webpack.deploy.js                                   deploy
    |   |-- webpack.dev.js                                      dev
    |-- src                                                     项目根目录
    |   |-- app                                                 app入口
    |   |   |-- layout                                          布局
    |   |   |-- pages                                           内置页面
    |   |   |   |-- home                                        首页
    |   |   |   |-- login                                       登陆
    |   |   |   |-- swagger                                     swagger解析
    |   |   |   |-- system                                      系统设置
    |   |   |-- index.tsx                                       入口文件
    |   |   |-- store.ts                                        系统设置基础状态
    |   |   |-- style.less                                      
    |   |   |-- subMenu.json                                    菜单配置文件
    |   |-- assets                                              静态资源
    |   |-- components                                          展示组件        
    |   |-- containers                                          容器组件
    |   |-- core                                                核心文件
    |   |-- store                                               全局状态
    |   |-- utils                                               工具类
    |   |-- index.html                                          启动模板
    |   |-- index.manifest                                      离线存储文件（未启用）
    |   |-- index.tsx                                           启动入口
    |   |-- style.less                                          
    |   |-- typings                                             类型定以
    |   |-- wtmfront                                            wtm文件
    |   |   |--registerHelper                                   模板帮助方法
    |   |   |--template                                         模板
    |-- package.json                 
    |-- tsconfig.json                                
    |-- webpack.config.js                                                                
    |-- wtmfront.json                                           wtm配置                             
```