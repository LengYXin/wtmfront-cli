/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-07-24 02:18:59
 * @modify date 2018-09-10 02:18:59
 * @desc [description]
*/
// import "../node_modules/antd/dist/antd.less"; 这种方式 production 模式生成文件。
/// <reference path="../typings/index.d.ts" />
import 'babel-polyfill';
require('antd/dist/antd.less')
require('ant-design-pro/dist/ant-design-pro.css')
require('nprogress/nprogress.css')
import App from "app/index";
import * as React from 'react';
import ReactDOM from 'react-dom';
import "./style.less";
ReactDOM.render( <App />,
  document.getElementById('root'));
