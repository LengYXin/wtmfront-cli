/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:52:27
 * @modify date 2018-09-12 18:52:27
 * @desc [description]
*/
import { action, observable, runInAction, toJS } from "mobx";
import { HttpBasics } from "./HttpBasics";
import { message } from "antd";
import wtmfront from 'wtmfront.json';
import Common from './Common';
export default class Store {
    constructor(public StoreConfig) {

    }
    CONFIGJSON: ISwaggerModel = {
        idKey: "id",    //唯一标识
        address: "",    //地址控制器
        columns: [],    //teble 列
        search: [],     //搜索条件
        install: [],    //添加字段
        update: []      //修改字段
    };
    Common = Common;
    /** dev 环境 加上代理 前缀 */
    address = PRODUCTION ? '' : '/api'
    url = wtmfront.standard
    /** Ajax   */
    Http = new HttpBasics(this.address + this.StoreConfig.address);
    /** 数据 ID 索引 */
    IdKey = 'id';
    /** table 列配置 */
    columns = []
    /** table 数据 */
    @observable dataSource = {
        count: 0,
        list: [],
        pageNo: 1,
        pageSize: 5
    };
    /** 搜索数据 */
    searchParams: any = {
        // pageNo: 1,
        // pageSize: 1
    };
    /** table 已选择 keys */
    @observable selectedRowKeys = [];
    /**  详情 */
    @observable details: any = {};
    @observable visible = {
        edit: false,
        port: false
    };
    /** 页面 配置 */
    @observable pageConfig = {
        /** Modal 显示状态  */
        // visible: false,
        /** 数据加载 */
        loading: false,
        /** 编辑 加载 */
        editLoading: false
    };
    /** true 修改 or false 添加 */
    @observable isUpdate = false;
    /** table 选择 行  */
    @action.bound
    onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
    }
    /**
     * 编辑 
     * 需要重写的方法 使用 runInAction 实现 修改Store 
     * 使用 @action.bound 装饰器的方法不可重写
     * @param details 
     */
    @action.bound
    async  onModalShow(details = {}) {
        if (details[this.IdKey] == null) {
            this.isUpdate = false;
        } else {
            this.isUpdate = true;
            details = await this.onGetDetails(this.details);
        }
        runInAction(() => {
            this.details = details;
        })
        this.onVisible(true);
    }
    /** 编辑 显示隐藏 */
    @action.bound
    onVisible(visible, type: "edit" | "port" = "edit") {
        this.visible[type] = visible;
    }
    /** 编辑加载状态 */
    @action.bound
    onEditLoading(visible = !this.pageConfig.editLoading) {
        this.pageConfig.editLoading = visible;
    }
    // 时间格式化
    dateFormat = 'YYYY-MM-DD';
    /** 加载数据 */
    async onGet(params?) {
        if (this.pageConfig.loading == true) {
            return message.warn('数据正在加载中');
        }
        runInAction(() => {
            this.pageConfig.loading = true;
        })
        this.searchParams = { ...this.searchParams, ...params };
        // 页码 参数特殊处理,不需要从 search 字段中传递
        let pageNo = this.dataSource.pageNo, pageSize = this.dataSource.pageSize;
        if (this.searchParams.pageNo) {
            pageNo = this.searchParams.pageNo;
            delete this.searchParams.pageNo;
        }
        if (this.searchParams.pageSize) {
            pageSize = this.searchParams.pageSize;
            delete this.searchParams.pageSize;
        }
        const result = await this.Http.create(this.url.search, { pageNo: pageNo, pageSize: pageSize, search: this.searchParams }).map(result => {
            if (result.list) {
                result.list = result.list.map((x, i) => {
                    return { key: i, ...x }
                })
            }
            return result
        }).toPromise();
        runInAction(() => {
            this.dataSource = result || this.dataSource;
            this.pageConfig.loading = false;
        });
        return result;
    }
    /** 加载数据 */
    async onGetDetails(params) {
        // const id = params[this.IdKey]
        const result = await this.Http.create(this.url.details, params).toPromise();
        // runInAction(() => {
        //     this.details = result;
        // });
        return result || {};
    }
    /** 编辑数据 */
    async onEdit(params) {
        if (this.pageConfig.editLoading) {
            return
        }
        const details = { ...this.details, ...params };
        this.onEditLoading(true);
        // 添加 | 修改 
        if (this.isUpdate) {
            return await this.onUpdate(details);
        }
        return await this.onInstall(details);

    }
    /** 添加数据 */
    async onInstall(params) {
        const result = await this.Http.create(this.url.install, params).toPromise();
        if (result) {
            message.success('添加成功');
            this.onGet();
            this.onVisible(false);
        } else {
            message.error('添加失败');
        }
        this.onEditLoading(false);
        return result;
    }
    /** 更新数据 */
    async onUpdate(params) {
        const result = await this.Http.create(this.url.update, params).toPromise();
        if (result) {
            message.success('更新成功');
            this.onGet();
            this.onVisible(false);
        } else {
            message.error('更新失败');
        }
        this.onEditLoading(false);
        return result;
    }
    /** 删除数据 */
    async onDelete(params: any[]) {
        params = params.map(x => x[this.IdKey])
        const result = await this.Http.create(this.url.delete, params).toPromise();
        return result;
    }
    /**
     * 导入
     * https://ant.design/components/upload-cn/#components-upload-demo-picture-style
     */
    onImport() {
        const action = this.address + this.StoreConfig.address + this.url.import.name
        return {
            name: 'file',
            multiple: true,
            action: action,
            onChange: (info) => {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
    }
    /**
     * 导出
     * @param params 筛选参数 
     */
    async onExport(params = this.searchParams) {
        console.log("onExport");
        const result = await this.Http.create(this.url.export, params).toPromise();
        return result;
    }
    /**
     * 获取公共属性
     */
    async getCombo(parmas: ICommon) {
        return await Common.getCombo(parmas);
    }
}
