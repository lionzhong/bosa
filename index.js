const fileParser = require('./modules/fileParser');
const watcher    = require('./modules/watcher');

fileParser.init();
watcher();
