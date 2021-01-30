'use strict';

const Mongoose = fastify.db.mongoose;

const { docSchema, baseSchema } = require('./base.model.js');
const validators = fastify.validators;
const modelConstants = fastify.modelConstants;


let fields = {
  fullName: {
    type: String,
  },
  email: {
    type: String,
    index: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        return validators.emailRegexChecker(email);
      },
      message: 'Email is invalid'
    },
    unique: [true, modelConstants.ERROR_TEMPLATES.DUPLICATE_FIELDS_NAMED.format({ field: 'Email' })],
    required: [true, modelConstants.ERROR_TEMPLATES.EMPTY_FIELD.format({ field: 'Email' })]
  },
  password: {
    type: String,
    set: fastify.hash.hashPassword,
    required: [true, modelConstants.ERROR_TEMPLATES.EMPTY_FIELD.format({ field: 'Password' })]
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
  }
};

let schema = new Mongoose.Schema(Object.assign({}, fields, baseSchema), { runSettersOnQuery: true, timestamps: true });

fastify.addSchemaHelper(schema);

schema.statics.getObjByEmail = async function (email) {
  email = email || null;
  let data = await this.findOne({ email });
  return data;
};

let StudentModel = Mongoose.model('student', schema);

module.exports = StudentModel;
