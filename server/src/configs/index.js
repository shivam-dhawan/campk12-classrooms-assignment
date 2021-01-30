'use strict';

module.exports = {
  'autoloadOpts': require('./autoload.config.js'),
  'corsOpts': require('./cors.config.js'),
  'dotenvOpts': require('./dotenv.config.js'),
  'helmetOpts': require('./helmet.config.js'),
  'rateLimitOpts': require('./rateLimit.config.js'),
  'loggerOpts': require('./logger.config.js'),
  'redisOpts': require('./redis.config.js'),
};
