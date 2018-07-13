#!/usr/bin/env node
const program = require('commander')
const download = require('../lib/download');
download();
// program.usage('<project-name>').parse(process.argv)

// // 根据输入，获取项目名称
// let projectName = program.args[0]

// if (!projectName) {  // project-name 必填
//   // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
//   program.help() 
//   return
// }

// go()

// function go () {
// 	// 预留，处理子命令  
// }
