'use strict';

module.exports = {
  authenticate: () => {
    return async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        throw err;
      }
    };
  },
  loginAuthenticate: () => {
    return async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (error) { }
    };
  },
  allowedUsers: (...allowedUsers) => {
    return async function (request, reply) {
      if (!request.user || (Number(request.user.role) !== fastify.modelConstants.ADMIN_ROLE_SUPER && allowedUsers.indexOf(Number(request.user.userType)) == -1)) {
        throw new fastify.errorCodes['FORBIDDEN']();
      }
    };
  },
  allowedAdmin: (...allowedAdmin) => {
    return async function (request, reply) {
      if (!request.user || (Number(request.user.role) !== fastify.modelConstants.ADMIN_ROLE_SUPER && allowedAdmin.indexOf(Number(request.user.role)) == -1)) {
        throw new fastify.errorCodes['FORBIDDEN']();
      }
    };
  },
};