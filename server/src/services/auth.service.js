'use strict';

const { AdminModel, StudentModel, TeacherModel } = require('../models');
const modelConstants = fastify.modelConstants;
const { generateToken } = require('../helpers/token.js');

class AuthService {
  constructor(userType) {
    this._userType = userType;
    this._model = (() => {
      if (userType == modelConstants.USER_TYPE_ADMIN) return AdminModel;
      if (userType == modelConstants.USER_TYPE_STUDENT) return StudentModel;
      if (userType == modelConstants.USER_TYPE_TEACHER) return TeacherModel;
      else throw new fastify.errorCodes['BAD_REQUEST_DATA']("Invalid userType");
    })();
  }

  async getOrCreateUser({ email }) {
    const password = process.env.DEFAULT_PASSWORD;
    const userObject = await this._model.findOneOrCreate({ email: email }, {
      password: password
    });
    const authToken = generateToken(userObject, this._userType);
    return {userObject, authToken};
  }
}

module.exports = AuthService;