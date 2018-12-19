const fs                = require('fs');
const Json2csvTransform = require('json2csv').Transform;
const util              = require('../modules/util');

const generatorCsv = sourceData => {

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

    util.output.json(`./data/temp/test.json`, csvData);

    const opts = { fields, withBOM: true, header: false, excelStrings: true };
    const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' };
    const input     = fs.createReadStream(`./data/temp/test.json`, { encoding: 'utf8' });
    const output    = fs.createWriteStream(`./data/csv/test.csv`, { encoding: 'utf8' });
    const converter = new Json2csvTransform(opts, transformOpts);

    input.pipe(converter).pipe(output);

};

module.exports = generatorCsv;
