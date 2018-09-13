/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 05:01:12
 * @modify date 2018-09-10 05:01:12
 * @desc [description]
*/
import { HttpBasics } from "core/HttpBasics";
import { action, observable, runInAction } from "mobx";
import { notification } from 'antd';
import lodash from 'lodash';
import wtmfront from 'wtmfront.json';
const Http = new HttpBasics("", res => {
    if (res.status == 200) {
        return res.response
    }
    return false
});
export default class ObservableStore {
    /**
     * 构造
     */
    constructor() {
        // notification.config({
        //     duration: 2,
        //     top: 60
        // })
        if (!PRODUCTION) {
            this.init();
        }
        // this.getModel();
    }
    /**当前进度 */
    @observable StepsCurrent = 0;
    /**是否连接脚手架 */
    @observable startFrame = false;
    /**项目信息 */
    @observable project = {
        containersPath: "",
        contextRoot: "",
        subMenuPath: "",
        wtmfrontConfig: {},
        templates: ['default']
    };
    /*** 现有模块列表 */
    @observable containers = [];
    /*** 模块列表 */
    @observable createParam = {
        // 组件信息
        containers: {},
        // 模型信息
        model: {}
    };
    @observable swaggerLoading = true;
    @observable createState = true;
    @observable docData = {
        // 模型控制器
        tags: [],
        // 公共接口
        common: [],
        // 模型列表
        definitions: {}
    };
    /**
     * 公共接口
     */
    common = "/common/combo"
    map = (x) => {
        if (x.code) {
            if (x.code == 200) {
                return x.data;
            }
            notification['error']({
                message: x.code,
                description: x.message,
            });
        }
        return false
    }
    /**
     * 初始化 项目信息
     */
    async init() {
        const data = await Http.post("/server/init", wtmfront).map(this.map).toPromise();
        runInAction(() => {
            this.project = data;
            this.startFrame = true;
        })
    }
    /**
     * 获取现有模块
     */
    async getContainers() {
        const data = await Http.get("/server/containers").map(this.map).toPromise();
        runInAction(() => {
            this.containers = data;
        })
    }
    /**
     * 创建模块
     * @param param 
     */
    async create(param?) {
        const data = await Http.post("/server/create", { ...this.createParam, ...param }).map(this.map).toPromise();
        if (data) {
            runInAction(() => {
                this.createState = true;
            });
            notification['success']({
                message: '创建成功',
                description: '',
            });
        }
        return data;
    }
    /**
     * 删除
     * @param param 
     */
    async  delete(param) {
        const data = await Http.post("/server/delete", param).map(this.map).toPromise();
        notification['success']({
            message: '删除成功',
            description: '',
        });
    }
    /**
     * 获取model
     */
    async getModel() {
        const data = await Http.get("/swaggerDoc").map(docs => this.formatDocs(docs)).toPromise();
        runInAction(() => {
            this.swaggerLoading = false;
            this.docData = data;
        })
        return data
    }
    /**
     * 格式化docs
     * @param docs 
     */
    formatDocs(docs) {
        if (!docs) {
            notification['error']({
                message: '获取Swagger文档失败',
                description: '',
            });
            return this.docData
        }
        let { tags, definitions, paths } = docs;
        let format = {
            // 模型控制器
            tags: [...tags],
            // 公共控制器
            common: [],
            // 模型列表
            definitions: { ...definitions }
        };
        try {
            // 分组所有 api 地址
            lodash.forEach(paths, (value, key) => {
                // const detail = lodash.find(value, (o) => o.tags && o.tags.length);
                let path: any = {};
                // 标准接口
                let standard: { name?: string, type?: string } = {};
                // 判断是否公用
                const isPubcliStandard = lodash.includes(key, wtmfront.standard.public.name);
                // 公共接口地址
                if (isPubcliStandard) {
                    format.common.push({
                        key,
                        path: value
                    });
                } else {
                    standard = lodash.find(wtmfront.standard, (o) => {
                        // console.log(key, o.name);
                        return lodash.includes(key, o.name)
                    })
                }
                // 请求类型 统一小写
                const typeKey = lodash.toLower(standard.type);
                // 获取文档中的对应类型接口
                path = value[typeKey];
                if (path) {
                    // 获取 tag 名称。
                    const tagName = lodash.find(path.tags, (o) => o && o.length);
                    const tag = lodash.find(format.tags, (o) => o.name == tagName);
                    // tag 已经存在直接 添加 api 解析地址
                    if (tag) {
                        // tag.paths = tag.paths || [];
                        // tag.paths.push({
                        //     key,
                        //     typeKey,
                        //     ...path
                        // });
                        tag.paths = tag.paths || {};
                        tag.paths[key] = {
                            key,
                            typeKey,
                            ...path
                        }
                    } else {
                        const tag = {
                            name: tagName,
                            // paths: [{
                            //     key,
                            //     typeKey,
                            //     ...path
                            // }]
                            paths: {}
                        }
                        tag.paths[key] = {
                            key,
                            typeKey,
                            ...path
                        }
                        format.tags.push(tag);
                    }
                }
            });
            // console.log(format);
            format.tags = format.tags.filter(x => !lodash.isNil(x.paths))
        } catch (error) {
            notification['error']({
                message: '解析Swagger文档失败',
                description: error,
            });
        }
        return format;
    }
    /**
     * 创建模块进度
     * @param StepsCurrent 进度
     */
    @action.bound
    updateStepsCurrent(StepsCurrent) {
        this.StepsCurrent += StepsCurrent;
    }
    @action.bound
    updateCPContainers(Containers = {}) {
        this.createParam.containers = { ...this.createParam.containers, ...Containers }
    }
    @action.bound
    updateCPmodel(model = {}) {
        this.createParam.model = { ...this.createParam.model, ...model }
    }
}




