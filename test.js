const fs     = require('fs');
const path   = require('path');
const log    = require('./modules/log');
const config = require('./config');

const folderPath = "d://cccc//aaaa//bb";

if (!fs.existsSync(folderPath)) {

    log.time(`路径不存在! ${folderPath} 开始创建路径`);

    const root = path.parse(folderPath).root;

    let folders = path.normalize(folderPath).split("\\");

    folders.splice(0, 1);

    const create = path => {

        return new Promise((resolve, reject) => {

            fs.mkdir(path, {}, (err) => {

                if (!err) {

                    resolve(`路径创建成功！${path}`, 2);

                } else {

                    log.red(`路径创建失败！${path}`, true);
                    console.error(err);
                    reject(err, `路径创建失败！${path}`);

                }

            });

        });

    };

    folders.forEach((folderName, index) => {

        const parsedPath = folders.slice(0, index + 1);
        const currentPath = path.join(root, ...parsedPath);

        if (!fs.existsSync(currentPath)) {

            (async () => {
                
                const result = await create(currentPath);

                if (index >= (folders.length - 1)) {

                    log.green(result, true);

                }

            })();

        }

    });

}
