const fs         = require('fs');
const path       = require('path');
const config     = require('../config');
const fileParser = require('./fileParser');
const log        = require('./log');

const watcher = () => {
    
    let timer;
    log.time(`开始监控原始数据目录 ${path.normalize(config.originalData)}`);

    const deBounce = files => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            console.log("\n");
            log.time(`监测到原始数据目录内有变化，开始数据转换! ${config.originalData} \n`);

            fileParser.init();

        }, 500);

    };

    fs.watch(path.normalize(`${config.originalData}`), {
        encoding: 'utf-8'
    }, (eventType, filename) => {
    
        if (filename) {

            deBounce(filename);

        }
    
    });

};

module.exports = watcher;
