const fs     = require('fs');
const moment = require('moment');
const log    = require('../modules/log');
const config = require('../config');
const path   = require('path');

const util = {
    folder: {

        create: (path, sync) => {

            if (sync === true) {

                if (!fs.existsSync(path)) {

                    fs.mkdirSync(path);
                    log.green(`${util.getTimeNow()} 目录创建成功：${path}`);
                    console.log('\n');

                } else {

                    console.log(`${util.getTimeNow()} 目录已存在：　${path} `);
                    console.log('\n');

                }

            } else {

                if (!fs.existsSync(path)) {

                    fs.mkdir(path, err => {

                        if (err) {

                            console.log(err);

                        } else {

                            log.green(`${util.getTimeNow()} 目录创建成功：${path}`);

                        }
                        console.log('\n');

                    });

                } else {

                    console.log(`${util.getTimeNow()} 目录已存在：　${path} `);

                }

            }

        },

        createConfig: () => {

            const doMkdir = folderPath => {

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

                                    process.exit();
                
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

            };

            [config.originalData, config.compiledData, config.csvData].forEach($path => doMkdir($path));

        }

    },
    getBirthdayByID: id => {

        let birthday = "";

        if (id != null && id !== "") {

            if (id.length === 15) {

                birthday = "19" + id.substr(6, 6);

            } else if (id.length === 18) {

                birthday = id.substr(6, 8);

            }

            birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");

        }

        return moment(birthday).format("YYYY-MM-DD");

    },
    getDataType: (data, type) => {

        let result = false;
        const getType = () => Object.prototype.toString.call(data);

        switch (type) {

            case "object":
                result = getType() === "[object Object]";
                break;
            case "string":
                result = getType() === "[object String]";
                break;
            case "function":
                result = getType() === "[object Function]";
                break;
            case "undefined":
                result = getType() === "[object Undefined]";
                break;

        }

        return result;

    },
    getTimeNow: () => {

        return moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss");

    },
    repeatStr: (str, length) => {

        return new Array(length).fill(str).join("");

    },
    cutline: (str, color) => {

        color = !color ? "green" : color;

        let cut = util.repeatStr("=", 60);

        [cut, ` ${str}`, cut, "\n"].forEach(temp => log[color](temp));

    },
    parseObjField: (key, obj) => {

        let locale = obj;
        const paths = key.split('.');
        const deplength = paths.length;
        let index = 0;

        while (locale && index < deplength) {

            locale = locale[paths[index++]];

        }

        return index === deplength ? locale : undefined;

    },
    sortArrByName: (arr, field) => {

        arr.sort((a, b) => {

            let [
                nameA,
                nameB
            ] = [
                field ? util.parseObjField(field, a).toUpperCase() : a.toUpperCase(),
                field ? util.parseObjField(field, b).toUpperCase() : b.toUpperCase()
            ];

            if (nameA < nameB) {

                return -1;

            }
            if (nameA > nameB) {

                return 1;

            }

            return 0;

        });

        return arr;

    },
    loading: () => {

        return (function () {

            let [p, x] = [
                ["\\", "|", "/", "─"], 0
            ];
            let interVal = setInterval(function () {

                process.stdout.clearLine(); // clear current text
                process.stdout.cursorTo(0); // move cursor to beginning of line
                process.stdout.write("\r" + p[x++]);
                x &= 3;

            }, 70);

            return {
                id: interVal
            };

        })();

    },
    clearLoading: interValID => {

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write("");
        clearInterval(interValID);

    },

    output: {

        json: (path, data) => {

            fs.writeFileSync(`${path}`, JSON.stringify(data, null, 4));

        }

    },

    array: {
        includes: (data, target) => {

            return Array.isArray(data) && data.length > 0 && data.includes(target);

        }
    },

    val: {

        inavailableArr: data => {

            return !Array.isArray(data) || data.length <= 0;

        },
        availableArr: data => {

            return Array.isArray(data) && data.length > 0;

        }
    }
};

module.exports = util;
