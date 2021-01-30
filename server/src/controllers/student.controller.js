'use strict';

const BaseAppController = require('./base.controller.js');

class StudentController extends BaseAppController {
  constructor(model) {
    super(model);
  }

  async getSelfObj(request, reply) {
    request.params.id = request.user.userId;
    await this.getObj(request, reply);
  }
}

module.exports = StudentController;
