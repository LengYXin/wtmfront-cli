# 核心基础类
?> 创建的组件模块中的 数据&渲染 属性函数都是从继承类种继承而来，跟后端的面向对象编程一样。

!>详情见代码注释
## 组件状态   
!>  框架状态管理依赖于 Mobx。<strong style="color:red">对象编程<strong><br>
吐槽：为啥不用redux和dva？（恶心） 。<br>
[传送门 React State](https://reactjs.org/docs/state-and-lifecycle.html) <br>
[传送门 Mobx](https://cn.mobx.js.org/)
### 数据处理基类  StoreBasice.ts （src/core/StoreBasice.ts）

?>数据表格 属性，方法<br>
table 数据获取函数，数据保存属性，数据添加修改，导入导出，表格配置。<br>

### ajax基类  HttpBasics.ts （src/core/HttpBasics.ts）

?>ajax 数据处理 默认导出为实例对象。命名导出为类定以<br>
>* 全局ajax配置
* 参数解析
* 请求处理
* 文件下载
* 状态码过滤

### 公共数据基类  Common.ts （src/core/Common.ts）

?>公共数据基类 默认导出为实例对象。命名导出为类定以<br>

### table 组件 (src/components/table)
>* dataEntry.tsx 表单 组件解析，根据字段类型渲染对应的表单组件
* tableBody.tsx  数据 表格 
* tableEdit.tsx  数据 编辑
* tableHeader.tsx 数据 搜索 头部
