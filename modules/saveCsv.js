const fs = require('fs');
const json2csv = require('json2csv');
const config  = require('../config');
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

        fs.writeFile(`${config.csvData}//${fileName}.csv`, csv, function (err) {

            if (err) throw err;
            console.log('file saved');

        });

    } catch (err) {

        console.error(err);

    }

};

module.exports = generatorCsv;
