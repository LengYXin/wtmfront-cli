const logSymbols = require('log-symbols');
const chalk = require('chalk');
const log = console.log;
module.exports = {
    success: (msg, ...age) => log(logSymbols.success, chalk.green(msg), ...age),
    info: (msg, ...age) => log(logSymbols.info, chalk.blue(msg), ...age),
    error: (msg, ...age) => log(logSymbols.error, chalk.red(msg), ...age),
    warning: (msg, ...age) => log(logSymbols.warning, chalk.yellow(msg), ...age),
}