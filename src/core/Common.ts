/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:52:42
 * @modify date 2018-09-12 18:52:42
 * @desc [description]
*/
import Http from './HttpBasics';
import { runInAction } from 'mobx';
class Common {
    constructor() {
        console.log("Common", this);
    }
    address = PRODUCTION ? '' : '/api';
    /** 缓存 http 请求 */
    CacheHttp = new Map<string, Promise<any>>();
    /** 缓存数据 */
    Cache = new Map<string, any>();
    async getCombo(parmas: ICommon) {
        const key = JSON.stringify(parmas)
        if (this.Cache.has(key)) {
            return this.Cache.get(key);
        }
        let promise: Promise<any>// = Http.get(this.address + parmas.address, parmas.params).toPromise();
        if (this.CacheHttp.has(key)) {
            promise = this.CacheHttp.get(key);
        } else {
            promise = Http.get(this.address + parmas.address, parmas.params).toPromise();
            // promise = new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         const list = [];
            //         for (let index = 0; index < 10; index++) {
            //             list.push({
            //                 key: index,
            //                 value: "value" + index
            //             })
            //         }
            //         resolve(list);
            //     }, 1000);
            // })
            this.CacheHttp.set(key, promise);
        }
        const data = await promise || [];
        this.Cache.set(key, data);
        return data;
    }
}
export default new Common();
