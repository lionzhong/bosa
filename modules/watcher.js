const fs = require('fs');
const path = require('path');
const config = require('../config');
const fileParser = require('./fileParser');

const watcher = () => {

    fs.watch(path.normalize(`${config.originalData}`), {
        encoding: 'utf-8'
    }, (eventType, filename) => {
    
        if (filename) {
    
            fileParser();
    
        }
    
    });

};

module.exports = watcher;
