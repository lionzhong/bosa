const fileParser = require('./modules/fileParser');
const watcher    = require('./modules/watcher');
const util       = require('./modules/util');

const createFolders = async () => {

    await util.folder.createConfig();

};

createFolders().then(() => {

    fileParser.init();
    watcher();

});
