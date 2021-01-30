'use strict';

const FORMAT = require('string-format');
FORMAT.extend(String.prototype);
const uuidv4 = require('uuid4');

const { loggerOpts, dotenvOpts, rateLimitOpts, corsOpts, helmetOpts, autoloadOpts } = require('../configs');
const initializeApp = async (options) => {
  options;
  const createRequestId = () => uuidv4();

  const fastify = require('fastify')({
    logger: loggerOpts,
    genReqId: createRequestId,
    ignoreTrailingSlash: true,
  });

  await fastify.register(require('fastify-env'), dotenvOpts)
  await fastify
        .register(require('fastify-blipp'))
        .register(require('fastify-autoload'), autoloadOpts) // loading plugin directory here
        .register(require('fastify-cors'), corsOpts)
        .register(require('fastify-helmet'), helmetOpts)
        .register(require('fastify-rate-limit'), rateLimitOpts)
        .register(require('fastify-redis'), require('../configs/redis.config.js'));

  fastify.decorate('addSchemaHelper', require('./schemaHelper.utility.js'));
  fastify.decorate('validators', require('./schemaValidator.utility.js'));

  fastify.modelConstants = require('../constants').modelConstants;
  global.fastify = fastify;

  const startServer = async () => {
    try {
      await fastify.ready();
      await require('../models/admin.model.js').checkOrCreateSuperAdmin();
      await fastify.listen({ port: fastify.config.PORT, host: fastify.config.SERVER_ADDRESS });
      if (process.env.NODE_ENV == 'localhost')
        fastify.blipp();

    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

  return { fastify, startServer };
};

module.exports = {
  initializeApp,
};
