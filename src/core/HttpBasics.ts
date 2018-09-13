/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:52:37
 * @modify date 2018-09-12 18:52:37
 * @desc [description]
*/
import Rx from "rxjs";
import { message, notification } from "antd";
import NProgress from 'nprogress';
import lodash from 'lodash';
export class HttpBasics {
    constructor(address?, public newResponseMap?) {
        if (address) {
            this.address = address;
        }
        // this.create({ type: "get", name: "test/{c}/{a}/{b}" }, { a: 1, b: 2, c: 3 }).toPromise();
    }
    /** 
     * 请求路径前缀
     */
    address = ""
    /**
     * 请求头
     */
    headers = {
        credentials: 'include',
        accept: "*/*",
        "Content-Type": "application/json",
    };
    /**
     * 请求超时设置
     */
    timeout = 5000;
    /**
     * 创建请求
     * @param request 
     * @param body 
     * @param headers 
     */
    create(request: { type: string, name: string }, body?: { [key: string]: any } | string, headers?: Object): Rx.Observable<any> {
        // 处理 路由参数  示例 "test/{c}/{a}/{b}"  从 body 提取参数
        if (/\/{\S*}/.test(request.name)) {
            if (typeof body == "object") {
                // debugger
                const urlStr = lodash.compact(request.name.match(/\/{\w[^\/{]*}/g).map(x => {
                    return body[x.match(/{(\w*)}/)[1]];
                })).join("/");
                request.name = request.name.replace(/\/{\S*}/, "/") + urlStr;
                if (request.type.toLocaleLowerCase() == "get") {
                    body = {};
                }
            }
        }
        return this[request.type.toLocaleLowerCase()](request.name, body, headers)
    }
    /**
     * get
     * @param url 
     * @param body 
     * @param headers 
     */
    get(url: string, body?: { [key: string]: any } | string, headers?: Object) {
        headers = { ...this.headers, ...headers };
        body = this.formatBody(body);
        url = `${this.address}${url}${body}`;
        return Rx.Observable.ajax.get(
            url,
            headers
        ).timeout(this.timeout).catch(err => Rx.Observable.of(err)).map(this.responseMap);
    }
    /**
     * post
     * @param url 
     * @param body 
     * @param headers 
     */
    post(url: string, body?: any, headers?: Object) {
        headers = { ...this.headers, ...headers };
        body = this.formatBody(body, "body", headers);
        url = `${this.address}${url}`;
        return Rx.Observable.ajax.post(
            url,
            body,
            headers
        ).timeout(this.timeout).catch(err => Rx.Observable.of(err)).map(this.responseMap);
    }
    /**
     * put
     * @param url 
     * @param body 
     * @param headers 
     */
    put(url: string, body?: any, headers?: Object) {
        headers = { ...this.headers, ...headers };
        body = this.formatBody(body, "body", headers);
        url = `${this.address}${url}`;
        return Rx.Observable.ajax.put(
            url,
            body,
            headers
        ).timeout(this.timeout).catch(err => Rx.Observable.of(err)).map(this.responseMap);
    }
    /**
     * delete
     * @param url 
     * @param body 
     * @param headers 
     */
    delete(url: string, body?: { [key: string]: any } | string, headers?: Object) {
        headers = { ...this.headers, ...headers };
        body = this.formatBody(body);
        url = `${this.address}${url}${body}`;
        return Rx.Observable.ajax.delete(
            url,
            headers
        ).timeout(this.timeout).catch(err => Rx.Observable.of(err)).map(this.responseMap);
    }
    jsonpCounter = 0;
    /**
     * jsonP
     */
    jsonp(url, body?: { [key: string]: any } | string, callbackKey = 'callback') {
        body = this.formatBody(body);
        url = `${this.address}${url}${body}&${callbackKey}=`;
        return new Rx.Observable(observer => {
            this.jsonpCounter++;
            const key = '_jsonp_callback_' + this.jsonpCounter;
            window[key] = (response) => {
                // clean up
                script.parentNode.removeChild(script);
                delete window[key];
                // push response downstream
                observer.next(response);
                observer.complete();
            };
            const script = document.createElement('script');
            script.src = url + key;
            script.onerror = (err) => observer.error(err);
            document.body.appendChild(script);
        })
    };
    /**
     * 格式化 参数
     * @param body  参数 
     * @param type  参数传递类型
     * @param headers 请求头 type = body 使用
     */
    formatBody(
        body?: { [key: string]: any } | any[] | string,
        type: "url" | "body" = "url",
        headers?: Object
    ) {
        // 加载进度条
        NProgress.start();
        // if (typeof body === 'undefined') {
        //     return '';
        // }
        if (type === "url") {
            let param = "";
            if (typeof body != 'string') {
                let parlist = [];
                lodash.forEach(body, (value, key) => {
                    if (!lodash.isNil(value) && value != "") {
                        parlist.push(`${key}=${value}`);
                    }
                });
                if (parlist.length) {
                    param = "?" + parlist.join("&");
                }
            } else {
                param = body;
            }
            return param;
        } else {
            // 处理 Content-Type body 类型 
            switch (headers["Content-Type"]) {
                case 'application/json;charset=UTF-8':
                    body = JSON.stringify(body)
                    break;
                case 'application/json':
                    if (lodash.isArray(body)) {
                        body = [...body]
                    }
                    if (lodash.isPlainObject(body)) {
                        body = { ...body as any }
                    }
                    break;
                case 'application/x-www-form-urlencoded':

                    break;
                case 'multipart/form-data':

                    break;
                case null:
                    delete headers["Content-Type"];
                    break;
                default:
                    break;
            }
            return body;
        }
    }
    notificationKey = "notificationKey"
    /**
     * ajax过滤
     */
    responseMap = (x) => {
        // 关闭加载进度条
        setTimeout(() => {
            NProgress.done();
        });
        if (this.newResponseMap && typeof this.newResponseMap == "function") {
            return this.newResponseMap(x);
        }
        if (x.status == 200) {
            if (x.response && x.response.status) {
                if (x.response.status == 200) {
                    return x.response.data;
                }
                notification['error']({
                    message: x.response.message,
                    description: `Url: ${x.request.url} \n method: ${x.request.method}`,
                });
                return false
                // throw x.response.message;
            }
            return x.response
        }
        notification['error']({
            key: this.notificationKey,
            message: x.message,
            description: x.request ? `Url: ${x.request.url} \n method: ${x.request.method}` : '',
        });
        console.error(x);
        // throw x;
        return false
    }
    /** 日志 */
    log(url, body, headers) {
    }
}
export default new HttpBasics();