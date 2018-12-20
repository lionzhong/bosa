const fs       = require('fs');
const json2csv = require('json2csv');
const config   = require('../config');
const log      = require('./log');
const path     = require('path');
// const Json2csvTransform = require('json2csv').Transform;
// const util = require('../modules/util');

const generatorCsv = (sourceData, fileName) => {

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
        "mobile": "",
        "telephone": ""
    };
    const csvData = [];
    const keys = Object.keys(defaultData).filter(key => key.includes("id_") && key !== "id_type");
    const fields = ["sort", "name", "traveller_type", "id_type", "id", "birthday", "mobile"];

    sourceData.forEach(data => {

        let obj = {};

        fields.forEach(key => {

            obj[key] = data[key];

        });

        if (obj.id === "") {

            keys.forEach(key => {

                if (data[key] !== "") {

                    obj.id = data[key];

                }

            });

        }

        csvData.push(obj);

    });

    try {

        const csv = json2csv.parse(csvData, {
            fields: fields,
            withBOM: true,
            header: false,
            excelStrings: true
        });

        const csvFile = path.join(config.csvData, `${fileName}.csv`);

        fs.writeFile(csvFile, csv, function (err) {

            if (!err) {

                log.green(`${csvFile} 转换成功!`, true);

            } else {

                switch (err.errno) {

                    case -4082:
                        log.red(`文件 ${csvFile} 转换失败。原因：文件正在被打开或锁死！`);
                        break;
                    default:
                        console.error(err);
                        break;

                }

            };

        });

    } catch (err) {

        console.error(err);

    }

};

module.exports = generatorCsv;
