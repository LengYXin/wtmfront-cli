/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 05:01:05
 * @modify date 2018-09-10 05:01:05
 * @desc [description]
*/
import { notification } from 'antd';
import lodash from 'lodash';
import { action, toJS, observable } from 'mobx';
import wtmfront from 'wtmfront.json';
import update from 'immutability-helper';
import swaggerDoc from './swaggerDoc';
export default class ObservableStore {
    /**
     * 构造
     */
    constructor(public swaggerDoc: swaggerDoc) {

    }
    ModelMap = new Map<string, any>();
    @observable visible = false;
    @observable Model: ISwaggerModel = {
        idKey: "id",    //唯一标识
        address: "",    //地址控制器
        columns: [],    //teble 列
        search: [],     //搜索条件
        // edit: {},    //编辑字段
        install: [],    //添加字段
        update: []      //修改字段
    }
    /** 选择的 tag */
    selectTag = {
        name: "",
        paths: []
    };
    /** swaggerDoc */
    definitions = null;// toJS(this.swaggerDoc.docData.definitions);
    @action.bound
    onVisible() {
        this.visible = !this.visible;
    }
    /**
     * 解析 tag
     * @param selectTag 
     */
    onAnalysis(index) {
        // console.time();
        if (!this.definitions) {
            this.definitions = toJS(this.swaggerDoc.docData.definitions);
        }
        const selectTag = this.selectTag = toJS(this.swaggerDoc.docData.tags[index]);
        if (this.ModelMap.has(selectTag.name)) {
            this.Model = this.ModelMap.get(selectTag.name);
        } else {
            this.analysisAddress();
            this.analysisColumns();
            this.analysisSearch();
            this.analysisEdit();
            this.ModelMap.set(selectTag.name, toJS(this.Model));
        }
        // console.timeEnd();
        console.log("--------------------------", this);
        return this.Model;
    }
    /**
     * 解析 路径地址前缀
     */
    @action.bound
    analysisAddress(tag = this.selectTag) {
        const path = lodash.find(tag.paths, (o) => lodash.includes(o.key, wtmfront.standard.search.name));
        this.Model.address = path.key.replace(wtmfront.standard.search.name, "");
    }
    /**
     * 解析 表格列字段
     */
    @action.bound
    analysisColumns(tag = this.selectTag) {
        const path = lodash.find(tag.paths, (o) => lodash.includes(o.key, wtmfront.standard.search.name));
        // 结果索引
        const responses = lodash.find(path.responses, 'schema');
        const definitions = this.analysisDefinitions(responses, true);

        this.Model.columns = lodash.toArray(definitions.properties);
    }
    /**
     * 解析 编辑列字段
     */
    @action.bound
    analysisEdit(tag = this.selectTag) {
        const pathInstall = lodash.find(tag.paths, (o) => lodash.includes(o.key, wtmfront.standard.install.name));
        const pathUpdate = lodash.find(tag.paths, (o) => lodash.includes(o.key, wtmfront.standard.install.name));
        // 结果索引
        const install = lodash.find(pathInstall.parameters, 'schema');
        const definitionsInstall = this.analysisDefinitions(install);
        // 结果索引
        const update = lodash.find(pathUpdate.parameters, 'schema');
        const definitionsUpdate = this.analysisDefinitions(update);
        this.Model.install = lodash.toArray(definitionsInstall.properties);
        this.Model.update = lodash.toArray(definitionsUpdate.properties);
    }
    /**
    * 解析 搜索列字段
    */
    @action.bound
    analysisSearch(tag = this.selectTag) {
        const path = lodash.find(tag.paths, (o) => lodash.includes(o.key, wtmfront.standard.search.name));
        // 参数 索引
        const parameters = lodash.find(path.parameters, 'schema');
        const schema = lodash.find(parameters, '$ref');
        const key = schema.$ref.match(/#\/definitions\/\S+\W(\w+)\W+/)[1];
        const definitions = lodash.cloneDeep(this.definitions[key]);
        this.setAttribute(definitions);
        this.Model.search = lodash.toArray(definitions.properties);
    }
    /**
     *  解析 模型
     * @param parameters 索引
     * @param isColumns 是否表格
     */
    analysisDefinitions(parameters, isColumns = false) {
        // const parameters = lodash.find(path.parameters, 'schema');
        const schema = lodash.find(parameters, '$ref');
        let key = schema.$ref.replace("#/definitions/", "");
        let definitions = this.definitions[key];
        if (isColumns) {
            try {
                // 匹配  AData«List«Corp»» 返回的列表数据结构
                key = definitions.properties.data.$ref.match(/#\/definitions\/\S+\W(\w+)\W+/)[1];
                definitions = this.definitions[key];
            } catch (error) {
                notification['error']({
                    message: '无法获取列表数据结构  解析失败',
                    description: '',
                });
                console.error(error);
            }
        }
        definitions = lodash.cloneDeep(definitions);
        this.setAttribute(definitions);
        return definitions
    }
    /**
     * 设置属性 
     * @param definitions 
     */
    setAttribute(definitions) {
        lodash.forEach(definitions.properties, (value, key) => {
            value.rules = [];
            // 添加验证
            if (!value.allowEmptyValue) {
                value.rules.push({ required: true, message: `Please input your ${value.key}!` });
            }
            if (typeof value.minLength != 'undefined') {
                value.rules.push({ min: value.minLength, message: `min length ${value.minLength}!` });
            }
            if (typeof value.maxLength != 'undefined') {
                value.rules.push({ max: value.maxLength, message: `max length ${value.maxLength}!` });
            }
            let attribute: IAttribute = {
                // 可用
                available: true,
                // 可编辑
                update: true,
                // 绑定模型公共地址
                // commonAddress: this.swaggerDoc.common,
            };
            if (value.example && value.example.combo) {
                attribute.common = {
                    address: this.swaggerDoc.common,
                    params: {
                        id: value.example.combo
                    }
                }
            }
            value.attribute = attribute;
            value.key = key;
            // console.log(x);
        })
    }
    /**
     * 交换模型位置
     */
    @action.bound
    onExchangeModel(type: "columns" | "search" | "install" | "update", dragIndex: number, hoverIndex: number) {
        let dataSource = toJS(this.Model[type]);
        const drag = dataSource[dragIndex];
        // const hover = dataSource[hoverIndex];
        // dataSource = lodash.fill(dataSource, drag, hoverIndex, hoverIndex + 1);
        // dataSource = lodash.fill(dataSource, hover, dragIndex, dragIndex + 1);
        // update

        this.Model[type] = update(dataSource, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, drag]]
        }) as any;
    }
}