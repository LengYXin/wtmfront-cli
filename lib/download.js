const download = require('download-git-repo')
const path = require('path');
const ora = require('ora');
const fsExtra = require('fs-extra');
const log = require('./log');
/**
 * 下载模板
 * @param {*} projectName 项目名称
 * @param {*} projectType 类型
 * @param {*} projectUrl git地址
 */
module.exports = (projectName = 'test', projectType, projectUrl) => {
    projectName = path.join(path.dirname(__dirname), 'temporary', projectName);
    fsExtra.removeSync(projectName);
    if (!projectUrl) {
        switch (projectType) {
            case 'react':
                projectUrl = "LengYXin/wtmfront-template-react"
                break;
            case 'vue':
                projectUrl = "LengYXin/wtmfront-template-vue"
                break;
            default:
                projectUrl = "LengYXin/wtmfront-template-react"
                break;
        }
    }
    const spinner = ora(`Download Temporary projectType=${projectType} projectUrl=${projectUrl}`).start();
    return new Promise((resolve, reject) => {
        // 下载 git 模板
        spinner.start();
        download(projectUrl,
            projectName, {}, (err) => {
                if (err) {
                    reject(err)
                } else {
                    spinner.stop();
                    log.success("Download Success");
                    resolve(projectName)
                }
            })
    })
}