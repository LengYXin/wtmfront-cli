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
    {
        "title": "公司名",
        "dataIndex": "corpName",
        "format": ""
    },
    {
        "title": "管理员ID",
        "dataIndex": "managerID",
        "format": ""
    },
    {
        "title": "上级公司ID",
        "dataIndex": "parentCorpID",
        "format": ""
    },
    {
        "title": "总员工数",
        "dataIndex": "corpEmpTotals",
        "format": "int32"
    },
    {
        "title": "使用与否",
        "dataIndex": "useYN",
        "format": "int32"
    },
    {
        "title": "创建用户ID",
        "dataIndex": "createUser",
        "format": ""
    },
    {
        "title": "创建日期",
        "dataIndex": "createDate",
        "format": "date-time"
    },
    {
        "title": "修改用户ID",
        "dataIndex": "updateUser",
        "format": ""
    },
    {
        "title": "修改日期",
        "dataIndex": "updateDate",
        "format": "date-time"
    }
]
}
export default new Store();