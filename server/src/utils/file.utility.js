'use strict';
const fs = require('fs');
const path = require('path');
const basePath = path.dirname(__dirname);

function fileReader(filePath, parse = false) {
  try {
    let jsonString = fs.readFileSync(path.join(basePath, filePath), 'utf-8');
    if (parse) {
      let data = JSON.parse(jsonString);
      return data;
    }
    return jsonString;
  }
  catch (error) {
    throw error;
  }
}

function fileWriter(filePath, data) {
  try {
    let jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(path.join(basePath, filePath), jsonString);
    return true;
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  fileReader,
  fileWriter
}