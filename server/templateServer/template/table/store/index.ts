import { action, observable, runInAction, toJS } from "mobx";
import { HttpBasics } from "utils/HttpBasics";
import { message } from "antd";
import storeBasice from 'store/storeBasice';
export class Store extends storeBasice {
    constructor() {
        super();
    }
    /** Ajax 拦截器  */
    Http = new HttpBasics('/api{{{ ApiName }}}');
    /** 数据 ID 索引 */
    IdKey = '{{{ IdKey }}}';
    /** table 列配置 */
    @observable columns = {{{ columns }}}
}
export default new Store();