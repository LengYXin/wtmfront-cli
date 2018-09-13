<!-- npm publish . --registry http://registry.npmjs.org  -->

# wtmfront-cli 

### Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=8.x, 8.x preferred), npm version 5+ and [Git](https://git-scm.com/).

``` bash
$ npm install -g wtmfront
```

### 创建项目

``` bash
$ wtmfront init  <project-name>
```
## 创建完成项目如下
### 目录介绍

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

### 脚手架使用介绍
>项目目录运行如下命令
``` bash
$ wtmfront server 或者 npm run server

<!-- 出现如下信息说明模板服务已开启 -->
√ 注入 registerHelper FormItem.js
√ 注入 registerHelper JSON.js
√ 模板服务已启动  ： http://localhost:8765

```

### 组件创建流程
#### 组件生成完成后可根据项目需求自由修改
>1：输入组件名称（必填 全英文），菜单名称 （可空，默认使用组件名称），选择模板
![Alt text](/doc/img/1.png)

>2：编辑排序需要使用的字段
>table  表格显示字段。
>search 搜索条件字段。
>add    添加&编辑字段。可用：添加数据使用，可编辑：编辑数据使用（模板未启用）
>关联模型 为 swagger 返回关联数据选项。 通过公共接口返回
![Alt text](/doc/img/2.png)
![Alt text](/doc/img/3.png)

>3：点击提交。提示 组件创建成功。等待重新编译完成。页面中就能看到创建的组件。
>创建完成的组件结构如下（根据模板生成）
>pageConfig.json 为swagger 解析后的数据原型
![Alt text](/doc/img/5.png)
### 组件创建内部流程
>1：接受传入的组件参数 名称，菜单，swagger 信息
>2：写入pageConfig.json 文件 （swagger 解析后的源数据）
>3：将swagger 写入 模板 > 分析数据，创建组件
>4：写入导出，供外部路由使用，src/containers/index.ts
>5：写入菜单 src/app/subMenu.json  
>6：等待webpack编译，创建完成。

#### 删除组件
>1：组件列表中直接选择需要删除的组件点击删除即可
![Alt text](/doc/img/4.png)


### 模板编写  [引擎 handlebarsjs](http://handlebarsjs.com/) 
只需要将模板文件目录放入 wtmfront/template 中，脚手架就会自动解析，放入模板选项中。
>注意：更改模板后需要重新启动模板服务才能生效

所有swagger解析数据将会自动传入到 template/[模板] 每个文件当中。
目前可用数据
``` js
        idKey: "id",    //唯一标识
        address: "",    //地址控制器
        columns: [],    //teble 列
        search: [],     //搜索条件
        install: [],    //添加字段
        update: []      //修改字段
```
模板当中这么使用这些数据  {{{ <解析方法> <数据Key> }}}
``` jsx
    import { action, observable, runInAction, toJS } from "mobx";
    import { HttpBasics } from "core/HttpBasics";
    import { message } from "antd";
    import storeBasice from 'core/storeBasice';
    export class Store extends storeBasice {
        constructor() {
            super({
                // api 地址前缀
                address: '{{{ address }}}'
            });
        }
        /** 数据 ID 索引 */
        IdKey ='{{{ idKey }}}';
        /** table 列配置  title dataIndex 必备字段 其他为api 返回默认字段*/
        columns = {{{JSONColumns columns }}}
    }
    export default new Store();
```
#### 解析后的文件 
``` jsx
    import { action, observable, runInAction, toJS } from "mobx";
    import { HttpBasics } from "core/HttpBasics";
    import { message } from "antd";
    import storeBasice from 'core/storeBasice';
    export class Store extends storeBasice {
        constructor() {
            super({
                // api 地址前缀
                address: '/corp/'
            });
        }
        /** 数据 ID 索引 */
        IdKey ='id';
        /** table 列配置  title dataIndex 必备字段 其他为api 返回默认字段*/
        columns = [
            {
                "title": "公司ID",
                "dataIndex": "id",
                "format": ""
            },
            ......
        ]
    }
    export default new Store();
```
#### 解析方法编写 {{{JSONColumns columns }}} 中的 JSONColumns
>wtmfront/registerHelper/JSON.js
``` js
    // registerHelper 接受2个参数  解析函数名称 （JSONColumns） & 解析 方法回调 返回解析后数据
    // person 为 传入的 数据原型 （swagger 解析的 columns 字段数据）
    Handlebars.registerHelper('JSONColumns', function (person) {
        return JSON.stringify(person.filter(x => x.attribute.available).map(x => {
            return {
                title: x.description,
                dataIndex: x.key,
                format: x.format || '',
            }
        }), null, 4)
    });

```
>jsx 模板 解析方法 在 wtmfront/registerHelper/FormItem.js 中


#### 菜单编辑
>拖拽编辑信息，点击保存 即可 （可用手动修改）
>每个菜单都有一个唯一Key 创建组件时生成，可作为权限管理使用
![Alt text](/doc/img/6.png)

#### 模板模板继承  (面向对象编程) 支持重写，但是不支持重载（js引擎原因）
>状态继承自  core/StoreBasice.ts 基础类
>body (table表格) 继承  components/table/tableBody.tsx    基础组件
>edit (编辑) 继承  components/table/tableEdit.tsx         基础组件
>header (搜索条件)  继承  components/table/tableHeader.tsx 基础组件
>数据解析           components/table/dataEntry.tsx         数据处理组件

