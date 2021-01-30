'use strict';
const crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
let generateRandomString = function (length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
let generateHash = function (password, salt) {
  const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  return hash.digest('hex').toString();
};

let compareHash = function (password, hashedPassword) {
  return (hashedPassword === generateHash(password, fastify.config.SECRET_SALT));
};

let hashPassword = function (password) {
  let hashPassword = password;
  hashPassword = generateHash(password, fastify.config.SECRET_SALT);
  return hashPassword;
};

module.exports = {
  generateRandomString,
  generateHash,
  compareHash,
  hashPassword
};
