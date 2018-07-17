const Handlebars = require("handlebars");
const fsExtra = require('fs-extra');
const path = require("path");
const log=require('../../lib/log');
// 解析枚举
function registerEnum(model) {
    let EnumTsx = [], enums = model.enum;
    if (Array.isArray(enums)) {
        EnumTsx = enums.map(x => {
            if (typeof x == 'string') {
                return ` <Option value='${x}'>${x}</Option>`;
            }
            return ` <Option value='未定义'>未定义</Option>`;
        });
    } else {
        EnumTsx = Object.keys(enums).map(x => {
            return ` <Option value='${x}'>${enums[x]}</Option>`;
        });
    }
    return `<Select placeholder='${model.key}' >
              ${EnumTsx.join('\n              ')}
            </Select>`;
}
function registerFieldDecorator(model) {
    const rules = [];
    let initialValue = `this.Store.details.${model.key} || ''`;
    let FormItem = ''
    // 添加验证
    if (!model.allowEmptyValue) {
        rules.push({ required: true, message: `Please input your ${model.key}!` });
    }
    if (typeof model.minLength != 'undefined') {
        rules.push({ min: model.minLength, message: `min length ${model.minLength}!` });
    }
    if (typeof model.maxLength != 'undefined') {
        rules.push({ max: model.maxLength, message: `max length ${model.maxLength}!` });
    }
    // 枚举
    if (model.enum) {
        FormItem = registerEnum(model);
    } else {
        switch (model.format) {
            case 'date-time':
                FormItem = ` <DatePicker   format={this.dateFormat} /> `;
                initialValue = `this.moment(this.Store.details.${model.key})`;
                break;
            case 'int32':
                FormItem = ` <InputNumber   /> `;
                initialValue = `this.Store.details.${model.key} || 0`;
                break;
            default:
                FormItem = `  <Input type="text" placeholder='${model.description}' />`;
                break;
        }
    }
    return {
        FormItem: FormItem,
        config: `
            {
                rules:${JSON.stringify(rules)},
                initialValue:${initialValue}
            }`
    }
}
Handlebars.registerHelper('EditFormItem', function (person) {
    return person.map(x => {
        const dec = registerFieldDecorator(x);
        return `<FormItem label="${x.description}" {...formItemLayout}>
            {getFieldDecorator('${x.key}',${dec.config})(
            ${dec.FormItem}
            )}
        </FormItem> `
    }).join('\n         ');
});
Handlebars.registerHelper('HeaderFormItem', function (person) {
    return person.map(x => {
        const dec = registerFieldDecorator(x);
        return `<Col xl={6} lg={8} md={12} >
            <FormItem label="${x.description}" {...formItemLayout}>
            {getFieldDecorator('${x.key}')(
                ${dec.FormItem}
            )}
            </FormItem>
        </Col> `
    }).join('\n         ');
});

/**
 * 模板解析
 */
module.exports = class {
    constructor(contextRoot) {
        /**
      * 解析目录
      */
        this.contextRoot = contextRoot;
        this.path = {
            pageConfig: path.join(this.contextRoot, 'pageConfig.json'),
            store: path.join(this.contextRoot, 'store', 'index.ts'),
            components: path.join(this.contextRoot, 'components'),
            body: path.join(this.contextRoot, 'components', 'Body.tsx'),
            edit: path.join(this.contextRoot, 'components', 'Edit.tsx'),
            Header: path.join(this.contextRoot, 'components', 'Header.tsx'),
        };
        this.pageConfig = null;
        this.searchKeys = [];
        this.columns = [];
        this.editKeys = [];
        this.ApiName = '';
        this.IdKey = '';
    }
    async render() {
        this.analysisJson();
        // return console.log(this);
        const renderColumns = this.renderColumns();
        const renderHeader = this.renderHeader();
        const renderEdit = this.renderEdit();
        await renderColumns;
        await renderHeader;
        await renderEdit;

    }
    /**
    * 写入 Header
    */
    async  renderHeader() {
        const source = await fsExtra.readFile(this.path.Header)
        const template = Handlebars.compile(source.toString());
        const result = template({
            searchKeys: this.searchKeys
        });
        await fsExtra.writeFile(this.path.Header, result)
    }
    /**
    * 写入 Edit
    */
    async  renderEdit() {
        const source = await fsExtra.readFile(this.path.edit)
        const template = Handlebars.compile(source.toString());
        const result = template({
            editKeys: this.editKeys
        });
        await fsExtra.writeFile(this.path.edit, result)
    }
    /**
     * 写入 列数据
     */
    async  renderColumns() {
        const source = await fsExtra.readFile(this.path.store)
        const template = Handlebars.compile(source.toString());
        const result = template({
            ApiName: this.ApiName,
            columns: JSON.stringify(this.columns, null, 4),
            IdKey: this.IdKey
        });
        await fsExtra.writeFile(this.path.store, result)
    }
    /**
     * 解析json
     */
    analysisJson() {
        try {
            const pageConfig = this.pageConfig = this.readJSON(this.path.pageConfig);
            const ApiName = this.ApiName = Object.keys(pageConfig.value)[0];
            this.searchKeys = pageConfig.value[ApiName]['get']['parameters'].map(x => {
                return {
                    key: x.name,
                    ...x
                }
            });
            // table 列
            this.columns = Object.keys(pageConfig.tableModel).filter(x => pageConfig.tableModel[x].show).map((x, i) => {
                let model = this.pageConfig.tableModel[x];
                return {
                    title: model.description,
                    dataIndex: model.key,
                    type: model.type,
                    format: model.format,
                    enum: model.enum
                    // key: model.key,
                }
            });
            const editKey = pageConfig.value[Object.keys(pageConfig.value)[0]]['post']['model']['properties'];
            this.editKeys = Object.keys(editKey).map(x => {
                let model = editKey[x];
                return {
                    key: x,
                    ...model
                }
            });
            const ApiDetails = Object.keys(pageConfig.value)[1];
            this.IdKey = /(.*\/){(\w*)}/.exec(ApiDetails)[2];
        } catch (error) {
            log.error("解析 JSON 出错", error);
            throw error;
        }
    }
    /**
    * 获取路由配置 json
    */
    readJSON(pathUrl) {
        return fsExtra.readJsonSync(pathUrl);
    }
}