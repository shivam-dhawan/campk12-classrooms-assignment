'use strict';

const Mongoose = fastify.db.mongoose;

const { docSchema, baseSchema } = require('./base.model.js');

let fields = {
  roomId: {
    type: String,
    index: true,
    required: true
  }
};

let schema = new Mongoose.Schema(Object.assign({}, fields, baseSchema), { runSettersOnQuery: true, timestamps: true });

fastify.addSchemaHelper(schema);

schema.statics.generateRoomId = async function () {
  let uniqueId, idCount;

  while (true) {
    uniqueId = fastify.hash.generateRandomString(6);
    idCount = await this.countDocuments({ roomId: uniqueId });
    if (uniqueId && idCount === 0) return uniqueId;
  }
};

let ClassroomModel = Mongoose.model('classroom', schema);

module.exports = ClassroomModel;
