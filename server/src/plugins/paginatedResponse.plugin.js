'use strict';

const fp = require('fastify-plugin');

function paginatedResponse(fastify, opts, done) {
  fastify.decorate('paginatedResponse', require('../utils').paginatedResponse);
  done();
}
module.exports = fp(paginatedResponse);
