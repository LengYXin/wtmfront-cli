import Rx from "rxjs";
import { message } from "antd";
export class HttpBasics {
    constructor(address?) {
        if (address) {
            this.address = address;
        }
    }
    /** 请求前缀 */
    address = ""
    headers = {
        credentials: 'include',
        accept: "*/*",
        "Content-Type": "application/json",
    };
    /** 格式化 get 参数  */
    formatBody(body?: { [key: string]: any } | string) {
        if (typeof body == 'undefined') {
            return '';
        }
        let param = "";
        if (typeof body != 'string') {
            let parlist = [];
            Object.keys(body).map(x => {
                const val = body[x];
                if (val) {
                    parlist.push(`${x}=${body[x]}`);
                }
            })
            param = "?" + parlist.join("&");
        } else {
            param = body;
        }
        return param;
    }
    get(url: string, body?: { [key: string]: any } | string, headers?: Object) {
        const param = this.formatBody(body),
            urlStr = `${this.address}${url}${param}`;
        headers = Object.assign({}, this.headers, headers);
        return Rx.Observable.ajax.get(
            urlStr,
            headers
        ).catch(err => Rx.Observable.of(err)).map(this.map);
    }
    post(url: string, body?: any, headers?: Object) {
        const urlStr = `${this.address}${url}`;
        headers = Object.assign({}, this.headers, headers);
        return Rx.Observable.ajax.post(
            urlStr,
            headers["Content-Type"] == 'application/json' ? JSON.stringify({ ...body }) : { ...body },
            headers
        ).catch(err => Rx.Observable.of(err)).map(this.map);
    }
    put(url: string, body?: any, headers?: Object) {
        const urlStr = `${this.address}${url}`;
        headers = Object.assign({}, this.headers, headers);
        return Rx.Observable.ajax.put(
            urlStr,
            JSON.stringify({ ...body }),
            headers
        ).catch(err => Rx.Observable.of(err)).map(this.map);
    }
    delete(url: string, body?: { [key: string]: any } | string, headers?: Object) {
        const param = this.formatBody(body),
            urlStr = `${this.address}${url}${param}`;
        headers = Object.assign({}, this.headers, headers);
        return Rx.Observable.ajax.delete(
            urlStr,
            headers
        ).catch(err => Rx.Observable.of(err)).map(this.map);
    }
    map = (x) => {
        if (x.status == 200) {
            if (x.response.status) {
                if (x.response.status == 200) {
                    return x.response.result;
                }
                message.error(x.response.message);
                throw x.response.message;
            }
            // if (x.response.status == 0) {
            //     message.error(x.response.message);
            // }
            return x.response
        }
        message.error(x.status);
        throw x;
    }
    /** 日志 */
    log(url, body, headers) {
    }
}
// export default new Http();