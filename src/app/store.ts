/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-07-24 05:02:33
 * @modify date 2018-07-24 05:02:33
 * @desc [description]
*/
import { message, notification } from "antd";
import { HttpBasics } from "core/HttpBasics";
import lodash from 'lodash';
import { action, observable, runInAction, toJS } from "mobx";
import { Help } from 'utils/Help';
import subMenuJson from './subMenu.json';
const subMenu = lodash.cloneDeep(subMenuJson.subMenu);
interface subMenu {
    Key?: string,
    Name?: string,
    Icon?: string,
    Path?: string,
    Component?: string,
    Children?: any[],
    // [key: string]: any
}
const Http = new HttpBasics(null, (x) => {
    if (x.status == 200) {
        if (x.response && x.response.status) {
            if (x.response.status == 200) {
                return x.response.result;
            }
            notification['error']({
                message: x.response.message,
                description: `Url: ${x.request.url} \n method: ${x.request.method}`,
            });
            throw x.response.message;
        }
        return x.response
    }
    console.log(x);
    notification['error']({
        message: x.message,
        description: `Url: ${x.request.url} \n method: ${x.request.method}`,
    });
    throw x;
});
export class Store {
    constructor() {
        subMenu.push({
            "Key": "system",
            "Name": "系统设置",
            "Icon": "setting",
            "Path": "/system",
            "Component": "",
            "Children": []
        });
        // 填充 Key
        const newGuid = (x: subMenu) => {
            if (typeof x.Key == "undefined" || x.Key == "") {
                x.Key = Help.GUID();
            }
            if (x.Children) {
                x.Children = x.Children.map(newGuid)
            } else {
                x.Children = [];
            }
            return {
                "Key": '',
                "Name": "菜单名称",
                "Icon": "menu-fold",
                "Path": "/",
                "Component": "",
                "Children": [],
                ...x,
            };
        }
        this.setSubMenu(subMenu.map(newGuid))
    }
    /** 菜单展开 收起 */
    @observable collapsed = false;
    /** 菜单 */
    @observable subMenu: subMenu[] = [];
    /**  设置菜单 */
    @action.bound
    setSubMenu(subMenu) {
        this.subMenu = subMenu;
    }
    /**
     * 提交修改菜单
     */
    @observable updateSubMenuLoading = false;
    async  updateSubMenu() {
        // return console.log(this.subMenu.filter(x => x.Key != "system"));
        const newMenu = toJS(this.subMenu).filter(x => x.Key != "system");
        if (lodash.isEqual(newMenu, subMenuJson.subMenu)) {
            return message.warn("菜单没有任何改变")
        }
        runInAction(() => this.updateSubMenuLoading = true)
        const data = await Http.post("/server/updateSubMenu", newMenu).toPromise();
        if (data) {
            notification['success']({
                message: '菜单修改成功',
                description: '',
            });
        } else {
            notification['error']({
                message: '菜单修改失败，请检查日志',
                description: '',
            });
        }
    }
    /** 菜单收起 展开 */
    @action.bound
    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }
}
export default new Store();