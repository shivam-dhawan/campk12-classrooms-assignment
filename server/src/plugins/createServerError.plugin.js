'use strict';

const fp = require('fastify-plugin');

function createServerError(fastify, opts, done) {
  fastify.decorate('createServerError', require('../utils').createServerError);
  done();
}
module.exports = fp(createServerError);
