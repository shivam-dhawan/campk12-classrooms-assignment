'use strict';

const BaseAppController = require('./base.controller.js');

class TeacherController extends BaseAppController {
  constructor(model) {
    super(model);
    this.getSelfObj = this.getSelfObj.bind(this);
  }

  async getSelfObj(request, reply) {
    request.params.id = request.user.userId;
    await this.getObj(request, reply);
  }
}

module.exports = TeacherController;
