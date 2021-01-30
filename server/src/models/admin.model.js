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
        return fastify.validators.emailRegexChecker(email);
      },
      message: "Email is invalid"
    },
    unique: [true, modelConstants.ERROR_TEMPLATES.DUPLICATE_FIELDS_NAMED.format({ field: 'Email' })],
    required: [true, modelConstants.ERROR_TEMPLATES.EMPTY_FIELD.format({ field: 'Email' })]
  },
  password: {
    type: String,
    set: fastify.hash.hashPassword,
    required: [true, modelConstants.ERROR_TEMPLATES.EMPTY_FIELD.format({ field: 'Password' })]
  },
  role: {
    type: Number,
    enum: modelConstants.ADMIN_ROLE_ENUM,
    default: modelConstants.ADMIN_ROLE_BASIC
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

schema.statics.checkOrCreateSuperAdmin = async function () {
  await this.findOneOrCreate({ role: modelConstants.ADMIN_ROLE_SUPER }, {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
    role: modelConstants.ADMIN_ROLE_SUPER
  });
}

let AdminModel = Mongoose.model('admin', schema);

module.exports = AdminModel;
