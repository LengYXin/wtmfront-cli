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
const log = require('../lib/log');
const download = require('../lib/download');

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
    spinner.stop();
    log.success("init Success");
}

