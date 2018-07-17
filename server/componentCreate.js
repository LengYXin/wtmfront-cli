const path = require("path");
const fs = require('fs');
const fsExtra = require('fs-extra');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fsEditor = editor.create(store);
const templateServer = require('./templateServer/analysis');
const log=require('../lib/log');
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
    }
    /**
     * 创建组件
     * @param {*} fsPath 
     */
    async create(component) {
        try {
            this.componentName = component.containers.containersName;
            if (!this.componentName) {
                throw "组件名称不能为空";
            }
            const fsPath = path.join(this.containersPath, this.componentName);
            if (fs.readdirSync(this.containersPath).some(x => x == this.componentName)) {
                throw "组件已经存在";
            } else {
                // 创建临时文件
                const temporaryPath = path.join(this.temporaryPath, this.componentName);
                const analysis = new templateServer(temporaryPath);
                this.mkdirSync(temporaryPath);
                // this.copy(path.join(this.templatePath, "table"), temporaryPath);
                fsExtra.copySync(path.join(this.templatePath, "table"), temporaryPath);
                fsExtra.writeJsonSync(path.join(temporaryPath, "pageConfig.json"), component.model, { spaces: 4 });
                await analysis.render();
                this.mkdirSync(fsPath);
                this.copy(temporaryPath, fsPath);
                this.writeRouters(component.containers, 'add');
                this.writeContainers();
                // 删除临时文件
                fsExtra.removeSync(temporaryPath);
                // // 修改 页面配置 模型
                // fsExtra.writeJsonSync(path.join(fsPath, "pageConfig.json"), component.model, { spaces: 4 });
            }
            log.success("create " + this.componentName);
        } catch (error) {
            log.error("error", error);
            throw error
        }

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
            const pathStr = path.join(this.containersPath, x);
            return fs.statSync(pathStr).isDirectory() && this.exists(path.join(pathStr, "index.tsx"))
        })
    }
}