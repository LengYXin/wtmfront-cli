
// import "../node_modules/antd/dist/antd.less"; 这种方式 production 模式生成文件。
// <reference path="./index.d.ts" />
require('antd/dist/antd.less')
require('ant-design-pro/dist/ant-design-pro.css')
import App from "app/index";
import * as React from 'react';
import ReactDOM from 'react-dom';
import "./style.less";
ReactDOM.render( <App />,
  document.getElementById('root'));
