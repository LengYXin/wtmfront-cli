const path = require("path");
const fs = require('fs');
const fsExtra = require('fs-extra');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fsEditor = editor.create(store);
const ora = require('ora');
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
        this.subMenuPath = path.join(this.contextRoot, "src", "app", "subMenu.json");
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
            // "type": "typescript",
            // "frame": "react",
            // "registerHelper": "wtmfront/registerHelper",
            // "template": "wtmfront/template",
            // "subMenu": "src/app/subMenu.json",
            // "containers": "src/containers",
        };
        /**
         * 模板文件列表
         */
        this.templates = [];
        /** 删除的列表 */
        this.deleteList = [];
        this.deleteTime = new Date().getTime();
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
        let subMenuPath = this.subMenuPath;
        try {
            containersPath = path.join(this.contextRoot, body.containers);
            subMenuPath = path.join(this.contextRoot, body.subMenu);
            this.containersPath = containersPath;
            this.subMenuPath = subMenuPath;
            this.wtmfrontConfig = Object.assign({}, this.wtmfrontConfig, body);
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    /**
     * 创建组件
     * @param {*} fsPath 
     */
    async create(components) {
        // const spinner = ora('Create Components').start();
        try {
            // this.componentName = component.containers.containersName;
            // console.log(JSON.stringify(component.containers, null, 4));
            // 清空目录
            fs.readdirSync(this.temporaryPath).map(dir => {
                fsExtra.removeSync(path.join(this.temporaryPath, dir));
            });
            this.deleteList = [];
            // 创建成功的组件
            const successList = [];
            for (let index = 0, length = components.length; index < length; index++) {
                const component = components[index];
                try {
                    const fsPath = path.join(this.containersPath, component.componentName);
                    // 创建临时文件
                    const temporaryPath = path.join(this.temporaryPath, component.componentName);
                    // 模板服务
                    const analysis = new templateServer(temporaryPath);
                    this.mkdirSync(temporaryPath);
                    // spinner.text = 'Create template';
                    this.createTemporary(component.template, temporaryPath);
                    // 写入配置文件。
                    // spinner.text = 'Create pageConfig';
                    fsExtra.writeJsonSync(path.join(temporaryPath, "pageConfig.json"), component, { spaces: 4 });
                    // spinner.text = 'analysis template';
                    await analysis.render();
                    successList.push(component);
                    log.success("创建成功 " + component.componentName);
                    // 创建目录
                    this.mkdirSync(fsPath);
                    // 拷贝生成组件
                    this.copy(temporaryPath, fsPath);
                    // 删除临时文件
                    fsExtra.removeSync(temporaryPath);
                } catch (error) {
                    log.error("创建失败 ", component.componentName);
                    log.error("error-", error);
                }
            }
            // 写入路由
            this.writeRouters(successList, 'add');
            // 生成导出
            this.writeContainers();
            //  修改 页面配置 模型
            log.success("create " + this.componentName);
            // spinner.text = 'writeRouters';
        } catch (error) {
            log.error("error", error);
            throw error
        } finally {
            // spinner.stop();
        }

    }
    /**
     * 创建临时目录
     * @param {*} template 模板名称
     * @param {*} temporaryPath  临时目录
     */
    createTemporary(template, temporaryPath) {
        if (template == null || template == "") {
            // template = "default";
            throw "没有找到模板文件"
        }
        // let templatePath = this.templatePath;
        let templatePath = path.join(this.contextRoot, this.wtmfrontConfig.template);
        // // 不是默认 模板 取 项目中的模板。
        // if (template != "default") {
        //     templatePath = path.join(this.contextRoot, this.wtmfrontConfig.template);
        // }
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
            // 防止操作太快。
            if (new Date().getTime() - this.deleteTime <= 3000) {
                throw "操作太快,请等待3秒后再试"
            }
            this.deleteTime = new Date().getTime();
            this.deleteList.push(componentName);
            this.writeContainers(componentName);
            // setTimeout(() => {
            fsExtra.removeSync(path.join(this.containersPath, componentName));
            this.writeRouters(componentName, 'delete');
            log.success("delete " + componentName);
            // });
        } catch (error) {
            log.error("delete ", error);
            throw error
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
        fsExtra.copySync(from, to)
        // log.info("create", to);
    }
    /**
     * 获取路由配置 json
     */
    readJSON() {
        return fsExtra.readJsonSync(this.subMenuPath);
    }
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /**
     * 写入路由  菜单
     * @param {*} components 
     */
    writeRouters(components, type = 'add') {
        if (this.exists(this.subMenuPath)) {
            // 读取路由json
            let routers = this.readJSON();
            if (type == 'add') {
                components.map(component => {
                    routers.subMenu.push({
                        "Key": component.key,//唯一标识
                        "Name": component.menuName,//菜单名称
                        "Icon": component.icon,//图标
                        "Path": `/${component.componentName}`,//路径
                        "Component": component.componentName,//组件
                        "Action": Object.keys(component.actions),//操作
                        "Children": []//子菜单
                    });
                })
            } else {
                // 删除
                const index = routers.subMenu.findIndex(x => x.Component == components);
                if (index != -1) {
                    routers.subMenu.splice(index, 1);
                }
                // console.log("index " + component, index);
            }
            // 写入json
            // editorFs.writeJSON(path.join(this.contextRoot, "src", "app", "a.json"), routers);
            fsExtra.writeJsonSync(this.subMenuPath, routers, { spaces: 4 });
            // log.success("writeRouters " + type, JSON.stringify(components, null, 4));
        } else {
            log.error("没有找到对应的路由JSON文件");
        }
    }
    /**
     * 修改菜单
     */
    updateSubMenu(subMenu) {
        let routers = this.readJSON();
        routers.subMenu = subMenu;
        fsExtra.writeJsonSync(this.subMenuPath, routers, { spaces: 4 });
        log.success("updateSubMenu ");
    }
    /**
     * 写入组件导出
     */
    writeContainers(componentName) {
        // 获取所有组件，空目录排除
        const containersDir = this.getContainersDir();
        // import 列表
        // let importList = containersDir.map(x => `import ${x} from 'containers/${x}';`);
        // importList.push('export default {\n    '
        //     + containersDir.join(",\n    ") +
        //     '\n}')
        // fs.writeFileSync(path.join(this.containersPath, "index.ts"), importList.join("\n"));
        let importList = containersDir.filter(component => {
            if (component == componentName || this.deleteList.some(x => component == x)) {
                return false;
            }
            return true;
        }).map(component => {
            return `${component}: () => import('./${component}').then(x => x.default)`
        });
        fs.writeFileSync(path.join(this.containersPath, "index.ts"), 'export default {\n    '
            + importList.join(",\n    ") +
            '\n}'
        );
        // log.success("writeContainers");
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