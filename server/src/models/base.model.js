'use strict';
/*
 *Summary: keep base schema objects that is common between Schemas.
 */
const Mongoose = fastify.db.mongoose;
const modelConstants = fastify.modelConstants;

const baseSchema = {
  createdBy: {
    type: Mongoose.Schema.Types.ObjectId,
    index: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
  },
};

const docSchema = {
  _id: false,
  displayOrder: {
    type: Number,
    default: 1
  },
  mediaUrl: {
    type: String,
    required: [true, modelConstants.ERROR_TEMPLATES.EMPTY_FIELD.format({ field: 'Media URL' })]
  },
  mediaType: {
    type: String,
    required: [true, modelConstants.ERROR_TEMPLATES.EMPTY_FIELD.format({ field: 'Media Type' })]
  }
};

const locationSchema = {
  _id: false,
  placeId: { type: String, index: true },
  name: { type: String },
  desc: { type: String },
  state: { type: String },
  country: { type: String }
};

const languageSchema = {
  _id: false,
  code: { type: String, index: true },
  name: { type: String },
};

module.exports = {
  baseSchema,
  docSchema,
  locationSchema,
  languageSchema
};
