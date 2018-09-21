# 快速开始
## 安装cli
安装 cli 工具，提供基础项目下载，模板服务

```bash
$ npm install -g wtmfront
```

## 初始化项目
?> 参数顺序为   <项目名称>   <框架>（现只有react） <模板地址>
```bash
$ wtmfront init <project-name> <react|vue>  <git-url>
```
## 启动项目
?> webpack 配置相同 
```bash
<!-- 根目录 -->
$ npm start | webpack-dev-server --open 
```
## 启动模板服务

``` bash
$ wtmfront server 或者 npm run server

<!-- 出现如下信息说明模板服务已开启 -->
√ 注入 registerHelper FormItem.js
√ 注入 registerHelper JSON.js
√ 模板服务已启动  ： http://localhost:8765

```
## 构建项目

``` bash
<!-- 根目录 -->
$ npm run build
```
