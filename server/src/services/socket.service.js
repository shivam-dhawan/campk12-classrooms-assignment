'use strict';
const io = fastify.socket;
const { USER_TYPE_STUDENT, USER_TYPE_TEACHER, 
  CLASS_EVENT_TYPE_CLASS_STARTED, CLASS_EVENT_TYPE_CLASS_ENDED, 
  CLASS_EVENT_TYPE_TEACHER_JOINED, CLASS_EVENT_TYPE_TEACHER_LEFT, 
  CLASS_EVENT_TYPE_STUDENT_JOINED, CLASS_EVENT_TYPE_STUDENT_LEFT } = fastify.modelConstants;
const { StudentModel, TeacherModel, ClassRegisterModel, ClassroomModel } = require('../models');

class SocketService {
  /**
   * On connection:
   *    - Add entry in ClassRegister
   *    - Add entry in redis to maintain list of connected users
   *    - Bind user, class details to socket instance.
   * 
   * On disconnec:
   *    - Add entry in ClassRegister
   *    - Remove entry from redis
   * 
   * On Class Start:
   *    - Generate classId and store it in redis
   *    - Add entry in ClassRegister
   * 
   * On Class End:
   *    - Remove entry from redis to prevent students from joining
   *    - Add entry in ClassRegister
   *    - Fire end event to everyone in room
   */
  constructor( ) {

  }

  bindEvents() {
    io.on('connection', async(socket) => {
      console.log('Connected');

      try {
        const payload = await fastify.jwt.verify(socket.handshake.query.token);
        // TODO: Prevent users from connecting without room
        if (payload.userType === USER_TYPE_STUDENT) 
          await this.handleStudentConnected(socket, payload, socket.handshake.query.roomId);
        else if (payload.userType === USER_TYPE_TEACHER) 
          await this.handleTeacherConnected(socket, payload, socket.handshake.query.roomId);
        
        console.log(`${socket.user.identifier} Auth.ed`);
        socket.on('startClass', (data) => { this.startClass(socket, data); });
        socket.on('endClass', (data) => { this.endClass(socket, data); });
        socket.on('disconnect', () => { this.disconnect(socket); });
      }
      catch (err) {
        console.log('Auth Failed');
        socket.emit('err', { message: 'Authentication failed' });
      }

    });
  }

  // TODO: Combine handlers into a generic one.
  async handleStudentConnected(socket, payload, roomId) {
    const user = await StudentModel.getObjByQuery({ _id: payload.userId, select: 'email', lean: true });
    const classroomObj = await ClassroomModel.getObjByQuery({
      roomId,
      lean: true
    });

    socket.user = {
      id: user._id,
      identifier: user.email,
      userType: USER_TYPE_STUDENT
    };
    socket.classroomId = classroomObj._id;
    socket.classId = await fastify.redis.get(`${classroomObj._id}:classId`);
    
    await ClassRegisterModel.createObj({
      eventType: CLASS_EVENT_TYPE_STUDENT_JOINED,
      classroomId: classroomObj._id,
      userId: user._id,
      onUserModel: StudentModel.modelName
    });
    await fastify.redis.sadd(`${socket.classroomId}:students`, user._id);

    socket.join(classroomObj._id);
    io.emit("userConnected", socket.user);
  }

  async handleTeacherConnected(socket, payload, roomId) {
    const user = await TeacherModel.getObjByQuery({ _id: payload.userId, select: 'email', lean: true });
    const classroomObj = await ClassroomModel.getObjByQuery({
      roomId,
      lean: true
    });

    socket.user = {
      id: user._id,
      identifier: user.email,
      userType: USER_TYPE_TEACHER
    };
    socket.classroomId = classroomObj._id;
    
    await ClassRegisterModel.createObj({
      eventType: CLASS_EVENT_TYPE_TEACHER_JOINED,
      classroomId: classroomObj._id,
      userId: user._id,
      onUserModel: TeacherModel.modelName
    });
    await fastify.redis.sadd(`${socket.classroomId}:teachers`, user._id);
    
    socket.join(classroomObj._id);
    io.emit("userConnected", socket.user);
  }

  async handleStudentDisconnected(socket) {
    await ClassRegisterModel.createObj({
      eventType: CLASS_EVENT_TYPE_STUDENT_LEFT,
      classroomId: socket.classroomId,
      classId: socket.classId,
      userId: socket.user.id,
      onUserModel: StudentModel.modelName
    });
    await fastify.redis.srem(`${socket.classroomId}:students`, socket.user._id);

    io.emit("userDisconnected", socket.user);
    socket.leave(socket.classroomId);
  }

  async handleTeacherDisconnected(socket) {
    await ClassRegisterModel.createObj({
      eventType: CLASS_EVENT_TYPE_TEACHER_LEFT,
      classroomId: socket.classroomId,
      classId: socket.classId,
      userId: socket.user.id,
      onUserModel: TeacherModel.modelName
    });
    await fastify.redis.srem(`${socket.classroomId}:teachers`, socket.user._id);
    
    io.emit("userDisconnected", socket.user);
    socket.leave(socket.classroomId);
  }

  async startClass(socket) {
    console.log('\n------>')
    console.log('Start Class');
    
    const classExists = await fastify.redis.exists(`${socket.classroomId}:classId`);
    if (!classExists) {
      const classId = await ClassRegisterModel.generateClassId();
      socket.classId = classId;
      
      await fastify.redis.set(`${socket.classroomId}:classId`, classId);
      await ClassRegisterModel.createObj({
        eventType: CLASS_EVENT_TYPE_CLASS_STARTED,
        classroomId: socket.classroomId,
        classId: classId,
      });
    }
  }

  async endClass(socket) {
    console.log('\n------>')
    console.log('End Class');
    
    const classExists = await fastify.redis.exists(`${socket.classroomId}:classId`);
    if (classExists) {
      await ClassRegisterModel.createObj({
        eventType: CLASS_EVENT_TYPE_CLASS_ENDED,
        classroomId: socket.classroomId,
        classId: socket.classId,
      });
      await fastify.redis.del(`${socket.classroomId}:classId`);
      await fastify.redis.del(`${socket.classroomId}:students`);
      await fastify.redis.del(`${socket.classroomId}:teachers`);
    } 
    io.emit("classEnded");
  }
  async disconnect(socket) {
    console.log('\n------>');
    console.log('Disconnect');
    
    if (socket.user && socket.classroomId) {
      if(socket.user.userType === USER_TYPE_STUDENT)
        await this.handleStudentDisconnected(socket);
      else if(socket.user.userType === USER_TYPE_TEACHER)
        await this.handleTeacherDisconnected(socket);
    }
  }
}

module.exports = SocketService;