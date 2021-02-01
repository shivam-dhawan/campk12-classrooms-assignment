'use strict';
const BaseAppController = require('./base.controller.js');
const { ClassroomModel, ClassRegisterModel, StudentModel, TeacherModel } = require('../models/index.js');
class ClassroomController extends BaseAppController {
  constructor(model) {
    super(model);
    this.joinRoom = this.joinRoom.bind(this);
    this.getReports = this.getReports.bind(this);
  }

  async joinRoom(request, reply) {
    const classroomObj = await ClassroomModel.getObjByQuery({ roomId: request.params.roomId, lean: true });
    const hasClass = await fastify.redis.exists(`${classroomObj._id}:classId`);
    if(!hasClass && request.user.userType === fastify.modelConstants.USER_TYPE_STUDENT)
      throw new fastify.errorCodes['CLASS_NOT_STARTED']();

    const [studentIds, teacherIds] = await Promise.all([
      fastify.redis.smembers(`${classroomObj._id}:students`),
      fastify.redis.smembers(`${classroomObj._id}:teachers`)
    ]);

    const [students, teachers] = await Promise.all([
      StudentModel.getList({ '_id:in': studentIds, select: 'email', lean: true }),
      TeacherModel.getList({ '_id:in': teacherIds, select: 'email', lean: true })
    ]);

    fastify.okResponse(request, reply, {
      classroom: classroomObj,
      students,
      teachers
    });
  }

  async getReports(request, reply) {
    const classroomObj = await ClassroomModel.getObjByQuery({ roomId: request.params.roomId, lean: true });
    const reports = await ClassRegisterModel.getPaginatedList({
      classroomId: classroomObj.id,
      populate: [[{ path: 'userId', select: 'email' }, { path: 'classroomId', select: 'roomId' }]],
      lean: true,
       ...request.query });

    fastify.okResponse(request, reply, reports); 
  }
}

module.exports = ClassroomController;
