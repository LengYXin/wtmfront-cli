import { configure } from "mobx";
configure({ enforceActions: true });
class store {
    constructor() {
        this.ready();
        this.init();
    }
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