const path = require("path");
const fs = require('fs');
const fsExtra = require('fs-extra');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fsEditor = editor.create(store);
const templateServer = require('./templateServer/analysis');
const registerHelper = require('./templateServer/registerHelper');
const log = require('../lib/log');
module.exports = class {
    constructor(contextRoot) {
        // this.Generator = Generator;
        // this.fs = this.Generator.fs;
        // 项目根路径  
        // if (this.Generator.samProject.create) {
        //     // 首次创建项目追加目录名称
        //     this.contextRoot = path.join(this.Generator.contextRoot,this.Generator.options.appname);
        // } else {
        this.contextRoot = contextRoot;
        // }
        /**
         * 创建的组件名称
         */
        this.componentName = null;
        /**
         * 容器组件路径
         */
        this.containersPath = path.join(this.contextRoot, "src", "containers");
        /**
         * 路由路径
         */
        this.routersPath = path.join(this.contextRoot, "src", "app", "routers.json");
        /**
         * 模板路径
         */
        this.templatePath = path.join(__dirname, 'templateServer', "template");
        /**
         * 临时目录
         */
        this.temporaryPath = path.join(__dirname, 'templateServer', "temporary");
        /**
         * 项目配置文件路径
         */
        this.wtmfrontPath = path.join(this.contextRoot, "wtmfront.json");
        /**
         * 项目配置
         */
        this.wtmfrontConfig = {
            contextRoot: this.contextRoot
        };
        /**
         * 模板文件列表
         */
        this.templates = ['default'];
        /**
         * 初始化配置
         */
        if (this.exists(this.wtmfrontPath)) {
            this.setWtmfrontConfig(fsExtra.readJsonSync(this.wtmfrontPath));
        }
        this.init();
    }
    /**
     * 初始化项目信息
     */
    init() {
        registerHelper(this.wtmfrontConfig);
        this.getTemplate();
    }
    /**
    * 初始化项目信息
    */
    setWtmfrontConfig(body) {
        let containersPath = this.containersPath;
        let routersPath = this.routersPath;
        try {
            containersPath = path.join(this.contextRoot, body.containers);
            routersPath = path.join(this.contextRoot, body.routers);
            this.containersPath = containersPath;
            this.routersPath = routersPath;
            this.wtmfrontConfig = { ...this.wtmfrontConfig, ...body };
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    /**
     * 创建组件
     * @param {*} fsPath 
     */
    async create(component) {
        try {
            this.componentName = component.containers.containersName;
            // console.log(JSON.stringify(component.containers, null, 4));
            // 过滤
            if (!this.componentName) {
                throw "组件名称不能为空";
            }
            // 组件目录不不存在 直接退出。
            if (!this.fsExistsSync(this.containersPath)) {
                throw "组件目录不存在 " + this.wtmfrontConfig.containers;
            }
            if (fs.readdirSync(this.containersPath).some(x => x == this.componentName)) {
                throw "组件已经存在 " + this.componentName;
            }
            const fsPath = path.join(this.containersPath, this.componentName);
            // 创建临时文件
            const temporaryPath = path.join(this.temporaryPath, this.componentName);
            // 模板服务
            const analysis = new templateServer(temporaryPath);
            this.mkdirSync(temporaryPath);
            this.createTemporary(component.containers.template, temporaryPath);
            // 写入配置文件。
            fsExtra.writeJsonSync(path.join(temporaryPath, "pageConfig.json"), component.model, { spaces: 4 });
            await analysis.render();
            // 创建目录
            this.mkdirSync(fsPath);
            // 拷贝生成组件
            this.copy(temporaryPath, fsPath);
            // 写入路由
            this.writeRouters(component.containers, 'add');
            // 生成导出
            this.writeContainers();
            // 删除临时文件
            fsExtra.removeSync(temporaryPath);
            //  修改 页面配置 模型
            log.success("create " + this.componentName);
        } catch (error) {
            log.error("error", error);
            throw error
        }

    }
    /**
     * 创建临时目录
     * @param {*} template 模板名称
     * @param {*} temporaryPath  临时目录
     */
    createTemporary(template, temporaryPath) {
        if (template == null || template == "") {
            template = "default";
        }
        let templatePath = this.templatePath;
        // 不是默认 模板 取 项目中的模板。
        if (template != "default") {
            templatePath = path.join(this.contextRoot, this.wtmfrontConfig.template);
        }
        // 拷贝模板文件 到临时目录 写入数据
        fsExtra.copySync(path.join(templatePath, template), temporaryPath);
    }
    fsExistsSync(path) {
        try {
            fs.accessSync(path, fs.F_OK);
        } catch (e) {
            return false;
        }
        return true;
    }
    /**
     * 删除组件
     * @param {*} componentName 
     */
    delete(componentName) {
        try {
            fsExtra.removeSync(path.join(this.containersPath, componentName));
            this.writeRouters(componentName, 'delete');
        } catch (error) {
            log.error("delete ", error);
        }
        finally {
            setTimeout(() => {
                this.writeContainers();
            }, 1000);
            log.success("delete " + componentName);
        }
    }
    /**
     * 是否存在目录
     * @param {*} fsPath 
     */
    exists(fsPath) {
        const exists = fsEditor.exists(fsPath);
        // console.log("exists：" + fsPath, exists);
        return exists
    }
    /**
     * 创建目录
     * @param {*} fsPath 
     */
    mkdirSync(fsPath) {
        fsExtra.ensureDirSync(fsPath);
        // console.log("mkdirSync");
    }
    /**
     * 拷贝文件
     * @param {*} from 
     * @param {*} to 
     */
    copy(from, to) {
        // this.fs.copy(
        //     from,
        //     to, {

        //     }, {
        //         globOptions: {
        //             dot: true
        //         }
        //     }
        // );
        fsExtra.copySync(from, to)
        log.info("create", to);
    }
    /**
     * 获取路由配置 json
     */
    readJSON() {
        // let routers = this.fs.readJSON(this.routersPath);
        let routers = fsExtra.readJsonSync(this.routersPath);
        // console.log("readJSON", routers);
        return routers
    }
    /**
     * 写入路由
     * @param {*} component 
     */
    writeRouters(component, type = 'add') {
        if (this.exists(this.routersPath)) {
            // 读取路由json
            let routers = this.readJSON();
            if (type == 'add') {
                routers.routers.push({
                    "name": component.menuName || component.containersName,
                    "path": `/${component.containersName}`,
                    "component": component.containersName
                });
            } else {
                const index = routers.routers.findIndex(x => x.component == component);
                if (index != -1) {
                    routers.routers.splice(index, 1);
                }
                // console.log("index " + component, index);
            }
            // 写入json
            // editorFs.writeJSON(path.join(this.contextRoot, "src", "app", "a.json"), routers);
            // fs.writeFileSync(this.routersPath, JSON.stringify(routers, null, 4));
            fsExtra.writeJsonSync(this.routersPath, routers, { spaces: 4 });
            log.success("writeRouters " + type, routers);
        } else {
            log.error("没有找到对应的路由JSON文件");
        }
    }
    /**
     * 写入组件导出
     */
    writeContainers() {
        // 获取所有组件，空目录排除
        const containersDir = this.getContainersDir();
        // import 列表
        let importList = containersDir.map(x => `import ${x} from 'containers/${x}';`);
        importList.push('export default {\n    '
            + containersDir.join(",\n    ") +
            '\n}')
        fs.writeFileSync(path.join(this.containersPath, "index.ts"), importList.join("\n"));
        log.success("writeContainers");
    }
    /**
     * 获取组件列表
     */
    getContainersDir() {
        return fs.readdirSync(this.containersPath).filter(x => {
            const pathStr = path.join(this.containersPath, x, "index.tsx");
            return this.exists(pathStr)
            // return fs.statSync(pathStr).isDirectory() && this.exists(path.join(pathStr, "index.tsx"))
        })
    }
    /**
     * 获取模板列表
     */
    getTemplate() {
        // const template = ['default'];
        if (this.wtmfrontConfig.template) {
            const templatePath = path.join(this.contextRoot, this.wtmfrontConfig.template);
            fs.readdirSync(templatePath).filter(x => {
                if (fs.statSync(path.join(templatePath, x)).isDirectory()) {
                    this.templates.push(x);
                }
            })
        }
        // return template;
    }
}