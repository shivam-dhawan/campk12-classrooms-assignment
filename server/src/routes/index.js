'use strict';

module.exports = function (fastify, opts, done) {
  fastify.register(require('./admin.routes'), { prefix: '/admins' });
  fastify.register(require('./student.routes'), { prefix: '/students' });
  fastify.register(require('./teacher.routes'), { prefix: '/teachers' });
  fastify.register(require('./auth.routes'), { prefix: '/auth' });
  fastify.register(require('./classroom.routes'), { prefix: '/classroom' });
  done();
};
