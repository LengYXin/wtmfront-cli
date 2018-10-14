#!/usr/bin/env node
const program = require('commander')  // npm i commander -D
const package = require('../package.json');
program.version(package.version, '-v, --version')
	.usage('<command> [项目名称]')
	.command('hello', 'hello')
	.command('init', 'init')
	.command('server', 'server')
	.command('update', 'update')
	.parse(process.argv)