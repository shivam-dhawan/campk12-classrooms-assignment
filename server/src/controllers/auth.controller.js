'use strict';

const { AuthService } = require('../services');

class AuthController {
  constructor() {}

  async getToken(request, reply) {
    const AUTHSERVICE = new AuthService(request.body.userType);
    const { userObject, authToken } = await AUTHSERVICE.getOrCreateUser(request.body.user);
    fastify.okResponse(request, reply, userObject, { authToken });
  }
}

module.exports = AuthController;
