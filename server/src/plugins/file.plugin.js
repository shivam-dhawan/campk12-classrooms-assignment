'use strict';

const fp = require('fastify-plugin');
const fileUtility = require('../utils').fileUtility;

function filePlugin(fastify, opts, done) {
  fastify.decorate('file', fileUtility);
  done();
}
module.exports = fp(filePlugin);
