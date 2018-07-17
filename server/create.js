const fs = require('fs');
const path = require('path');
// console.log(path.join(__dirname, "template", "table.tsx"));
// console.log(path.dirname(__dirname));

// function writeFile(params) {
//     fs.writeFile('test.ts', ``, (err) => {
//         if (err) throw err;
//         console.log('创建成功');
//     });
// }
// fs.readFile(path.join(path.dirname(__dirname), 'src', 'routersConfig.ts'), (err, data) => {
//     if (err) throw err;
//     // console.log(data.toString());
//     // console.log(Buffer.from('/*wirte-import*/'));
// })
module.exports = (params, contextRoot) => {
    // console.log(__dirname);

    return new Promise((resolve, reject) => {
        const newPath = path.join(contextRoot, 'src', 'containers', params.routerUrl);
        try {
            fs.accessSync(newPath, fs.constants.R_OK | fs.constants.W_OK);
            resolve(false);
        } catch (err) {
            // 创建目录
            fs.mkdirSync(newPath);
            // 拷贝模板
            fs.copyFile(path.join(__dirname, "template", "table.tsx"), path.join(newPath, "index.tsx"), (err) => {
                if (err) throw err;
                const configPath = path.join(contextRoot, 'src', 'routersConfig.ts');
                //写入文件
                fs.readFile(configPath, (err, data) => {
                    if (err) throw err;
                    // console.log(data.toString());
                    // console.log(Buffer.from('/*wirte-import*/'));
                    let dataStr = data.toString();
                    dataStr = dataStr.replace('/*wirte-import*/', `import ${params.routerUrl} from './containers/${params.routerUrl}';
/*wirte-import*/`).replace('/*wirte-Routers*/', `{
        name: "${params.routerName}",
        path: "/${params.routerUrl}",
        component: ${params.routerUrl},
    },
    /*wirte-Routers*/`)
                    fs.writeFile(configPath, dataStr, (err) => {
                        if (err) throw err;
                        console.log('创建成功');
                        resolve(true);
                    });
                })
            });
        }
    })
}
