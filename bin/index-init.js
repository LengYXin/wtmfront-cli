#!/usr/bin/env node
const program = require('commander');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const fsExtra = require('fs-extra');
const ora = require('ora');
const store = memFs.create();
const fsEditor = editor.create(store);
const rootPath = process.cwd();
const path = require('path');
const chalk = require('chalk');
const child_process = require('child_process')
const log = require('../lib/log');
const download = require('../lib/download');
const server = require('../server/index');

// download('test');

program.usage('<project-name>').parse(process.argv)

// 根据输入，获取项目名称
const projectName = program.args[0]

if (!projectName) {  // project-name 必填
    // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
    log.warning(`输入项目名称`);
    program.help()
    return
}
const projectPath = path.join(rootPath, projectName);
// 判断项目是否存在
if (fsEditor.exists(path.join(projectPath, 'package.json'))) {
    return log.error(`项目 ${projectName} 已存在`);
}
const spinner = ora('init').start();
// 下载 拷贝文件
goDownload();
async function goDownload() {
    const target = await download(projectName);
    spinner.start();
    fsExtra.copySync(target, projectPath);
    log.success("init Success");
    // spinner.stop();
    spinner.text = 'npm install ( *¯ ꒳¯*) 正在下载包依赖，还请耐心等待一会~';
    const procChild = child_process.exec('npm install --loglevel=notice', { cwd: projectPath, maxBuffer: 999999999 }, (error, stdout, stderr) => {
        spinner.stop();
        if (error) {
            log.error(error);
            log.info('请到 项目重新安装依赖 npm install ');
        } else {
            start();
            log.success("npm install Success");
        }
        // console.log(error, stdout, stderr);
    });
    // procChild.stdout.on("data", data => {
    //     console.log('stdout', data);
    // })
    // procChild.stderr.on("data", data => {
    //     console.log(chalk.blue(data));
    // })
}
function start() {
    // 服务
    new server(projectPath).init(8765);
    // open项目
    const procChild = child_process.exec( `code -g -n ${projectPath}`, { cwd: projectPath, maxBuffer: 999999999 }, (error, stdout, stderr) => {
        if (error) {
            log.error(error);
            log.error('vscode 打开项目出错啦~ 请手动打开项目 ( *¯ ꒳¯*)');
        }
    });
    // procChild.stdout.on("data", data => {
    //     console.log('stdout', data);
    // })
    // procChild.stderr.on("data", data => {
    //     console.log('stderr', chalk.blue(data));
    // })
}

