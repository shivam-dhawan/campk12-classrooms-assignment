'use strict';

let { generateThumnailUrl } = require('./model.utility.js');

let emailRegexChecker = function (value) {
  const emailRegex = /^[a-z][a-z|0-9|]*([_+.-][a-z|0-9]+)*?@[a-z][a-z|0-9|]*\.([a-z][a-z|0-9]*(\.[a-z][a-z|0-9]*)?)$/;
  return emailRegex.test(value);
};


let arrayLengthValidator = function (min, max) {
  return (array) => {
    if (min && array.length < min) return false;
    if (max && array.length > max) return false;
    return true;
  };
};


let mediaTypeValidator = function (mediaType) {
  return (doc) => {
    if (typeof doc == 'object') {
      return doc.mediaType == mediaType;
    } else {
      for (let obj of doc) {
        if (obj.mediaType != mediaType) {
          return false;
        }
      }
      return true;
    }
  };
};


// eslint-disable-next-line no-useless-escape
let regexValidator = function (expression = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})') {
  const strongRegex = new RegExp(expression);
  return (password) => {
    return strongRegex.test(password);
  };
};

let generateThumbnailValidator = function () {
  return (imageShema) => {
    generateThumnailUrl(imageShema);
    return true;
  };
};

/**
 * @description Perform a count query on passed model & return true if referenced id is valid.
 * @param mongooseModel: Pass mongoose model
 */
let refValidator = function (mongooseModel) {
  return async function (_id) {
    let res = await mongooseModel.countDocuments({ _id });
    return res >= 1;
  };
};

let dateValidator = function (value) {
  // Check whether the given value is of the format YYYY-MM-DD
  if (!/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(value))
    return false;

  // Check whether a given value is a valid date. 2019-02-30 is not a valid date
  return new Date(value).getDate() == Number(value.split('-')[2]);
};

module.exports = {
  emailRegexChecker,
  arrayLengthValidator,
  mediaTypeValidator,
  refValidator,
  dateValidator,
  generateThumbnailValidator,
  regexValidator
};
