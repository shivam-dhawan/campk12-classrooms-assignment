'use strict';

const AuthController = require('../controllers').AuthController;
const auth = new AuthController();

module.exports = function (fastify, opts, next) {

  fastify.post('/', { }, auth.getToken);

  next();
};
