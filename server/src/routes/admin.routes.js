'use strict';

const AdminModel = require('../models').AdminModel;
const AdminController = require('../controllers').AdminController;
const admin = new AdminController(AdminModel);

const { ADMIN_ROLE_BASIC, ADMIN_ROLE_SUPER } = fastify.modelConstants;
const onRequestBasicAdminValidations = [fastify.auth.authenticate(), fastify.auth.allowedAdmin(ADMIN_ROLE_BASIC)];
const onRequestSuperAdminValidations = [fastify.auth.authenticate(), fastify.auth.allowedAdmin(ADMIN_ROLE_SUPER)];


module.exports = function (fastify, opts, next) {

  fastify.get('/', { onRequest: onRequestBasicAdminValidations }, admin.getList);

  fastify.post('/', { onRequest: onRequestSuperAdminValidations }, admin.createObj);

  fastify.get('/:id', { onRequest: onRequestBasicAdminValidations }, admin.getObj);

  fastify.put('/:id', { onRequest: onRequestSuperAdminValidations }, admin.updateObj);

  fastify.delete('/:id', { onRequest: onRequestSuperAdminValidations }, admin.deleteObj);

  next();
};
