'use strict';

const StudentModel = require('../models').StudentModel;
const StudentController = require('../controllers').StudentController;
const student = new StudentController(StudentModel);

const { ADMIN_ROLE_BASIC, ADMIN_ROLE_SUPER, USER_TYPE_STUDENT } = fastify.modelConstants;
// const onRequestBasicAdminValidations = [fastify.auth.authenticate(), fastify.auth.allowedAdmin(ADMIN_ROLE_BASIC)];
// const onRequestBasicStudentValidations = [fastify.auth.authenticate(), fastify.auth.allowedUsers(USER_TYPE_STUDENT)];
// const onRequestSuperAdminValidations = [fastify.auth.authenticate(), fastify.auth.allowedAdmin(ADMIN_ROLE_SUPER)];
const onRequestBasicAdminValidations = [];
const onRequestBasicStudentValidations = [];
const onRequestSuperAdminValidations = [];


module.exports = function (fastify, opts, next) {

  fastify.get('/', { onRequest: onRequestBasicAdminValidations }, student.getPaginatedList);

  fastify.post('/', { onRequest: onRequestSuperAdminValidations }, student.createObj);

  fastify.get('/:id', { onRequest: onRequestBasicAdminValidations }, student.getObj);

  fastify.get('/me', { onRequest: onRequestBasicStudentValidations }, student.getSelfObj);

  fastify.put('/:id', { onRequest: onRequestSuperAdminValidations }, student.updateObj);

  fastify.delete('/:id', { onRequest: onRequestSuperAdminValidations }, student.deleteObj);

  next();
};
