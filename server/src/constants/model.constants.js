'use strict';

const ERROR_TEMPLATES = {
  DUPLICATE_FIELDS_NAMED: 'Value for {field} already exists.',
  EMPTY_FIELD: '{field} can\'t be empty',
};

const USER_TYPE_ADMIN = 1;
const USER_TYPE_USER = 2;
const USER_TYPE_ENUM = [USER_TYPE_ADMIN, USER_TYPE_USER];
const USER_TYPE_STR_MAPPER = {
  'admins': 1,
  'users': 2
};

const ADMIN_ROLE_BASIC = 10;
const ADMIN_ROLE_SUPER = 19;
const ADMIN_ROLE_ENUM = [ADMIN_ROLE_BASIC, ADMIN_ROLE_SUPER];
const ADMIN_ROLE_STR = {
  10: 'basic',
  19: 'super'
};

const TOKEN_TYPE_AUTH = 'auth';
const TOKEN_TYPE_VERIFY = 'verify';

const ENUM_TYPE_GENDER = ['m', 'f', 'o'];

module.exports = {
  ERROR_TEMPLATES,

  USER_TYPE_ADMIN,
  USER_TYPE_USER,
  USER_TYPE_ENUM,
  USER_TYPE_STR_MAPPER,

  ADMIN_ROLE_BASIC,
  ADMIN_ROLE_SUPER,
  ADMIN_ROLE_ENUM,
  ADMIN_ROLE_STR,

  TOKEN_TYPE_AUTH,
  TOKEN_TYPE_VERIFY,

  ENUM_TYPE_GENDER,

};
