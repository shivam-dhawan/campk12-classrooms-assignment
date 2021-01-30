'use strict';

const TeacherModel = require('../models').TeacherModel;
const TeacherController = require('../controllers').TeacherController;
const teacher = new TeacherController(TeacherModel);

const { ADMIN_ROLE_BASIC, ADMIN_ROLE_SUPER, USER_TYPE_TEACHER } = fastify.modelConstants;
// const onRequestBasicAdminValidations = [fastify.auth.authenticate(), fastify.auth.allowedAdmin(ADMIN_ROLE_BASIC)];
// const onRequestBasicTeacherValidations = [fastify.auth.authenticate(), fastify.auth.allowedUsers(USER_TYPE_TEACHER)];
// const onRequestSuperAdminValidations = [fastify.auth.authenticate(), fastify.auth.allowedAdmin(ADMIN_ROLE_SUPER)];
const onRequestBasicAdminValidations = [];
const onRequestBasicTeacherValidations = [];
const onRequestSuperAdminValidations = [];


module.exports = function (fastify, opts, next) {

  fastify.get('/', { onRequest: onRequestBasicAdminValidations }, teacher.getPaginatedList);

  fastify.post('/', { onRequest: onRequestSuperAdminValidations }, teacher.createObj);

  fastify.get('/:id', { onRequest: onRequestBasicAdminValidations }, teacher.getObj);

  fastify.get('/me', { onRequest: onRequestBasicTeacherValidations }, teacher.getSelfObj);

  fastify.put('/:id', { onRequest: onRequestSuperAdminValidations }, teacher.updateObj);

  fastify.delete('/:id', { onRequest: onRequestSuperAdminValidations }, teacher.deleteObj);

  next();
};
