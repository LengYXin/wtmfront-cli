# 组件创建流程
### 组件生成完成后可根据项目需求自由修改
>1：输入组件名称（必填 全英文），菜单名称 （可空，默认使用组件名称），选择模板
![Alt text](https://raw.githubusercontent.com/LengYXin/wtmfront-cli/master/docs/img/1.png)

>2：编辑排序需要使用的字段
>table  表格显示字段。
>search 搜索条件字段。
>add    添加&编辑字段。可用：添加数据使用，可编辑：编辑数据使用（模板未启用）
>关联模型 为 swagger 返回关联数据选项。 通过公共接口返回
![Alt text](https://raw.githubusercontent.com/LengYXin/wtmfront-cli/master/docs/img/2.png)
![Alt text](https://raw.githubusercontent.com/LengYXin/wtmfront-cli/master/docs/img/3.png)

>3：点击提交。提示 组件创建成功。等待重新编译完成。页面中就能看到创建的组件。
>创建完成的组件结构如下（根据模板生成）
>pageConfig.json 为swagger 解析后的数据原型
![Alt text](https://raw.githubusercontent.com/LengYXin/wtmfront-cli/master/docs/img/5.png)
### 组件创建内部流程
>1：接受传入的组件参数 名称，菜单，swagger 信息
>
>2：写入pageConfig.json 文件 （swagger 解析后的源数据）
>
>3：将swagger 写入 模板 > 分析数据，创建组件
>
>4：写入导出，供外部路由使用，src/containers/index.ts
>
>5：写入菜单 src/app/subMenu.json  
>
>6：等待webpack编译，创建完成。