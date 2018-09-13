/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:52:57
 * @modify date 2018-09-12 18:52:57
 * @desc [description]
*/
import { configure } from "mobx";
import user from './user';
configure({ enforceActions: "observed" });
class store {
    constructor() {
        this.ready();
        this.init();
    }
    User = new user();
    /**
     * 定义全局 变量 枚举 ===
     */
    ready() {
        console.log("-----------ready Store------------", this);
    }
    init() {

    }
};
export default new store();