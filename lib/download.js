const download = require('download-git-repo')
const path = require('path');
/**
 * 下载模板
 */
module.exports = (target = 'tmp') => {
    target = path.join(path.dirname(__dirname), 'temporary', target)
    return new Promise((resolve, reject) => {
        // 下载 git 模板
        download('LengYXin/samsundot-cli#template',
            target, {}, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(target)
                }
            })
    })
}