'use strict';
const BaseAppController = require('./base.controller.js');
const ClassRegisterModel = require('../models/classRegister.model');
class ClassroomController extends BaseAppController {
  constructor(model) {
    super(model);
    this.joinRoom = this.joinRoom.bind(this);
    this.getReports = this.getReports.bind(this);
  }

  async joinRoom(request, reply) {
    throw new fastify.errorCodes['CLASS_NOT_STARTED']();
  }

  async getReports(request, reply) {
    const reports = await ClassRegisterModel.getPaginatedList({
      classroomId: request.params.id,
      populate: [[
        { path: 'userId', model: 'onUserModel', select: 'fullName' }, 
        { path: 'classroomId' }]],
      lean: true,
       ...request.query });

    fastify.okResponse(request, reply, reports); 
  }
}

module.exports = ClassroomController;
