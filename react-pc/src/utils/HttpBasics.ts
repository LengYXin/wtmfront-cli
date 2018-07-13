import Rx from "rxjs";
import { message } from "antd";
export class HttpBasics {
    constructor(address?) {
        if (address) {
            this.address = address;
        }
    }
    address = ""
    headers = {
        credentials: 'include',
        accept: "*/*",
        "Content-Type": "application/json",
    };
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
        let param = this.formatBody(body);
        return Rx.Observable.ajax.get(`${this.address}${url}${param}`,
            {
                ...this.headers,
                ...headers
            }).catch(err => Rx.Observable.of(err)).map(this.map);
    }
    post(url: string, body?: any, headers?: Object) {
        return Rx.Observable.ajax.post(`${this.address}${url}`,
            JSON.stringify({ ...body }),
            {
                ...this.headers,
                ...headers
            }).catch(err => Rx.Observable.of(err)).map(this.map);
    }
    put(url: string, body?: any, headers?: Object) {
        return Rx.Observable.ajax.put(`${this.address}${url}`,
            JSON.stringify({ ...body }),
            {
                ...this.headers,
                ...headers
            }).catch(err => Rx.Observable.of(err)).map(this.map);
    }
    delete(url: string, body?: { [key: string]: any } | string, headers?: Object) {
        let param = this.formatBody(body);
        return Rx.Observable.ajax.delete(`${this.address}${url}${param}`,
            {
                ...this.headers,
                ...headers
            }).catch(err => Rx.Observable.of(err)).map(this.map);
    }
    map(x) {
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
        throw x;
    }
}
// export default new Http();