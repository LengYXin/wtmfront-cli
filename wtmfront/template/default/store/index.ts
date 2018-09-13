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