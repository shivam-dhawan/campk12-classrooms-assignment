'use strict';

module.exports = function (fastify, opts, done) {
  fastify.register(require('./admin.routes'), { prefix: '/admins' });
  done();
};
