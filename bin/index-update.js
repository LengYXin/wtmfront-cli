#!/usr/bin/env node
const program = require('commander');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fsEditor = editor.create(store);
const rootPath = process.cwd();
const path = require('path');
const log = require('../lib/log');
const server = require('../server/index');
program.usage('<port>').parse(process.argv)

// 根据输入，获取项目名称
const port = program.args[0]
// 判断项目是否存在
if (fsEditor.exists(path.join(rootPath, 'package.json'))) {
    if (fsEditor.exists(path.join(rootPath, 'wtmfront.json'))) {
        console.log("更新项目中的文件");
    } else {
        return log.error(`找不到 wtmfront.json 配置文件~`);
    }
} else {
    return log.error(`找不到项目~`);
}

