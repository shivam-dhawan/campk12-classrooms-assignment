'use strict';

/**
 * Allows access to env variables using
 * `fastify.config.VARIABLE_NAME`
 */

const BASE_ENV = {
  APP_NAME: {
    type: 'string',
    default: process.env.APP_NAME
  },
  PORT: {
    type: 'number',
    default: 3000
  },
  DEBUG: {
    type: 'boolean',
    default: false
  },
  SERVER_ADDRESS: {
    type: 'string',
    default: '0.0.0.0'
  },
  ALLOWED_HOSTS: {
    type: 'string',
    default: process.env.ALLOWED_HOSTS
  },
  ALLOWED_PORTS: {
    type: 'string',
    default: '3000::8000'
  },
  SECRET_SALT: {
    type: 'string',
    default: process.env.SECRET_SALT
  },
  PAGE_SIZE: {
    type: 'number',
    default: 20
  }
};

const JWT_ENV = {
  JWT_SECRET_KEY: {
    type: 'string',
    default: process.env.JWT_SECRET_KEY
  },
  JWT_SESSION_REDIS_EXPIRY_TIME: {
    type: 'number',
    default: 604800
  },
  JWT_EXPIRY_TIME: {
    type: 'string',
    default: '7d'
  },
  JWT_ALGORITHM: {
    type: 'string',
    default: 'HS256'
  },
  PASSWORD_RESET_TTL: {
    type: 'number',
    default: process.env.PASSWORD_RESET_TTL
  },
  USE_JWT_REDIS: {
    type: 'boolean',
    default: process.env.USE_JWT_REDIS
  }
};

const schema = {
  type: 'object',
  properties: Object.assign({},
    BASE_ENV,
    JWT_ENV
  )
};


let options = {
  confKey: 'config', // optional, default: 'config'
  schema: {
    ...schema,
    required: Object.keys(schema.properties)
  },
  dotenv: true
};
module.exports = options;
