'use strict';

const fp = require('fastify-plugin');

const { authenticate, allowedUsers, allowedAdmin, loginAuthenticate } = require('../utils').authUtility;

function authPlugin(fastify, opts, done) {
  fastify.decorate('auth', { authenticate, allowedUsers, allowedAdmin, loginAuthenticate });
  done();
}
module.exports = fp(authPlugin);
