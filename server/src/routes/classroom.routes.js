'use strict';

const ClassroomModel = require('../models').ClassroomModel;
const ClassroomController = require('../controllers').ClassroomController;
const classroom = new ClassroomController(ClassroomModel);

const { ADMIN_ROLE_BASIC, ADMIN_ROLE_SUPER, USER_TYPE_STUDENT } = fastify.modelConstants;
// const onRequestBasicAdminValidations = [fastify.auth.authenticate(), fastify.auth.allowedAdmin(ADMIN_ROLE_BASIC)];
// const onRequestBasicStudentValidations = [fastify.auth.authenticate(), fastify.auth.allowedUsers(USER_TYPE_STUDENT)];
const onRequestBasicAdminValidations = [];
const onRequestBasicStudentValidations = [];


module.exports = function (fastify, opts, next) {

  fastify.get('/', { onRequest: onRequestBasicAdminValidations }, classroom.getPaginatedList);

  fastify.post('/', { onRequest: onRequestBasicAdminValidations }, classroom.createObj);

  fastify.post('/:id/join', { onRequest: onRequestBasicStudentValidations }, classroom.joinRoom);

  fastify.get('/:id/reports', { onRequest: onRequestBasicAdminValidations }, classroom.getReports);

  next();
};
