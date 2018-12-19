const fs = require('fs');
const log = require('./log');
const util = require('./util');
const saveCsv = require('./saveCsv');
const config = require('../config');
const path = require('path');

const doPrase = (filePath, fileName) => {

    if (fs.existsSync(filePath)) {

        let originalData = fs.readFileSync(path.join(config.originalData, `${fileName}.${config.originalExt}`), 'utf-8');
    
        originalData = originalData.split("\n");
    
        if (originalData.length <= 0) {
    
            log.red(`原始数据解析为空数据！原因：请检查原始数据中是否存在数据，每条数据一行！`, true);
    
        } else {
    
            // 移除每行数据中多余的字符
            originalData = originalData.map(ele => {
    
                const isChild = ele.includes("儿童");
    
                [/\n/g, /\d(.*?)[.]/, /\d(.*?)[。]/, /[.。]/, /[(](.*?)[)]/g, /[（](.*?)[）]/g, /[“”；，‘’！~@#￥%……&*（）——]/g].forEach(reg => {
    
                    ele = ele.replace(reg, "");
    
                });
    
                ele = ele.replace(/[:：]/g, " ");
                ele = ele.replace(/[\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\"|\'|\,|\<|\.|\>|\?]/g, "");
    
                ["散舱", "儿童", "全陪"].forEach(str => {
    
                    ele = ele.replace(str, "");
    
                });
    
                ele += ` ${isChild  ? "儿童" : ""} `;
    
                ele = ele.replace(/\s+/g, " ");
    
                ele = ele.trim();
    
                return ele;
    
            });
    
            originalData = originalData.filter(ele => ele !== "");
    
            const meta = {
                "sort": "序号",
                "id": "身份证",
                "id_tw": "台胞证",
                "id_hk": "港澳通行证",
                "id_passport": "护照",
                "id_army": "军官证",
                "id_famliy": "户口",
                "id_type": "证件类型",
                "name": "姓名",
                "traveller_type": "旅客类型",
                "mobile": "手机号",
                "telephone": "座机号",
                "birthday": "出生日期"
            };
            const defaultData = {
                "sort": -1,
                "id": "",
                "id_tw": "",
                "id_hk": "",
                "id_passport": "",
                "id_army": "",
                "id_famliy": "",
                "id_type": "",
                "name": "",
                "traveller_type": "",
                "mobile": "",
                "telephone": "",
                "birthday": ""
            };
    
            let result = [JSON.parse(JSON.stringify(Object.assign({}, meta, {
                "id": "证件号码"
            })))];
    
            const regular = {
    
                "id": /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
                "id_tw": /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/,
                "id_hk": /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/,
                "id_passport": /^([a-zA-z]|[0-9]){5,17}$/,
                "id_army": /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/,
                "id_famliy": /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                // "name": /[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*?/,
                "mobile": /^1[3|4|5|7|8]\d{9}$/,
                "telephone": /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
    
            };
    
            const parseData = (data, reg, obj, key) => {
    
                for (let i = 0; i < data.length; i++) {
    
                    if (reg.test(data[i])) {
    
                        obj[key] = data[i];
                        data = data.splice(i, 1);
                        break;
    
                    }
    
                }
    
            };
    
            originalData.forEach((data, index) => {
    
                const obj = JSON.parse(JSON.stringify(defaultData));
    
                data = data.replace(/\s+/g, " ").split(" ");
    
                obj.traveller_type = data.findIndex(str => str.includes("儿童")) > -1 ? "儿童" : "成人";
    
                [
                    "id",
                    "mobile",
                    "id_hk",
                    "id_tw",
                    "id_passport",
                    "id_army"
                ].forEach(key => parseData(data, regular[key], obj, key));
    
                Object.keys(obj).forEach(key => {
    
                    if (key.includes("id") && key !== "id_type" && obj[key] !== "") {
    
                        obj.id_type = meta[key];
    
                    }
    
                });
    
                if (obj.id !== "") {
    
                    obj.birthday = util.getBirthdayByID(obj.id);
    
                }
    
                obj.sort = index + 1;
                obj.name = data.join("").trim();
    
                result.push(obj);
    
            });
    
            util.output.json(path.join(config.compiledData, `${fileName}.json`), result);
    
            saveCsv(result, fileName);
    
        }
    
    } else {
    
        log.red(`原始数据文件不存在！(${filePath})`, true);
    
    }

};

const batchParser = files => {

    files.forEach(file => {

        const originExt = `.${config.originalExt}`;

        doPrase(path.join(config.originalData, file), file.replace(originExt, ""));

    });
    
};

module.exports = {
    init: () => {

        fs.readdir(config.originalData, (err, files) => {
    
            if (!err) {
    
                files = files.filter(file => file.endsWith(`.${config.originalExt}`));
    
                batchParser(files);
        
            } else {
        
                console.error(err);
        
            }
        
        });

    },
    batch: batchParser
};
