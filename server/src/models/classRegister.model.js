'use strict';

const Mongoose = fastify.db.mongoose;

const { docSchema, baseSchema } = require('./base.model.js');
const validators = fastify.validators;
const modelConstants = fastify.modelConstants;

let fields = {
  eventType: {
    type: Number,
    enum: modelConstants.CLASS_EVENT_TYPE_ENUM,
    required: true
  },
  classroomId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'classroom',
    validate: [
      validators.refValidator(Mongoose.model('classroom')), 'Not a valid classroom'
    ],
    index: true,
    required: true
  },
  classId: {
    type: String
  },
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    refPath: 'onUserModel',
    index: true,
    sparse: true
  },
  onUserModel: {
    type: String
  }
};

let schema = new Mongoose.Schema(Object.assign({}, fields, baseSchema), { runSettersOnQuery: true, timestamps: true });

fastify.addSchemaHelper(schema);

schema.virtual('event').get(function () {
  return modelConstants.CLASS_EVENT_TYPE_STR[Number(this.eventType)];
});

schema.statics.generateClassId = async function () {
  let uniqueId, idCount;

  while (true) {
    uniqueId = fastify.hash.generateRandomString(10);
    idCount = await this.countDocuments({ classId: uniqueId });
    if (uniqueId && idCount === 0) return uniqueId;
  }
};

let ClassRegisterModel = Mongoose.model('classRegister', schema);

module.exports = ClassRegisterModel;
