const Handlebars = require("handlebars");
const fsExtra = require('fs-extra');
const path = require("path");
const log = require('../../lib/log');
const registerHelper = require('./registerHelper');
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
        const result = template(this.pageConfig);
        await fsExtra.writeFile(this.path.Header, result)
    }
    /**
    * 写入 Edit
    */
    async  renderEdit() {
        const source = await fsExtra.readFile(this.path.edit)
        const template = Handlebars.compile(source.toString());
        const result = template(this.pageConfig);
        await fsExtra.writeFile(this.path.edit, result)
    }
    /**
     * 写入 列数据
     */
    async  renderColumns() {
        const source = await fsExtra.readFile(this.path.store)
        const template = Handlebars.compile(source.toString());
        // const result = template({
        //     url: JSON.stringify(this.pageConfig.url, null, 4),
        //     columns: JSON.stringify(this.pageConfig.table.filter(x => x.show), null, 4),
        //     IdKey: this.pageConfig.IdKey
        // });
        const result = template(this.pageConfig);
        await fsExtra.writeFile(this.path.store, result)
    }
    /**
     * 解析json
     */
    analysisJson() {
        try {
            const pageConfig = this.pageConfig = this.readJSON(this.path.pageConfig);
            // const ApiName = this.ApiName = Object.keys(pageConfig.value)[0];
            // this.searchKeys = pageConfig.value[ApiName]['get']['parameters'].map(x => {
            //     return {
            //         key: x.name,
            //         ...x
            //     }
            // });
            // // table 列
            // this.columns = Object.keys(pageConfig.tableModel).filter(x => pageConfig.tableModel[x].show).map((x, i) => {
            //     let model = this.pageConfig.tableModel[x];
            //     return {
            //         title: model.description,
            //         dataIndex: model.key,
            //         type: model.type,
            //         format: model.format,
            //         enum: model.enum
            //         // key: model.key,
            //     }
            // });
            // const editKey = pageConfig.value[Object.keys(pageConfig.value)[0]]['post']['model']['properties'];
            // this.editKeys = Object.keys(editKey).map(x => {
            //     let model = editKey[x];
            //     return {
            //         key: x,
            //         ...model
            //     }
            // });
            // const ApiDetails = Object.keys(pageConfig.value)[1];
            // this.IdKey = /(.*\/){(\w*)}/.exec(ApiDetails)[2];
            // const ApiName = this.ApiName = Object.keys(pageConfig.value)[0];
            // this.searchKeys = pageConfig.search.filter(x => x.show);
            // table 列
            // this.columns = pageConfig.table.filter(x => x.show);
            // this.editKeys = pageConfig.edit.filter(x => x.show);;
            // this.IdKey = pageConfig.IdKey;
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