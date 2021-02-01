'use strict';

let modelConstants = fastify.modelConstants;

let generateToken = function (userObj, type) {
  let tokenType = modelConstants.TOKEN_TYPE_VERIFY;
  const payload = fastify.jwt.generatePayload(userObj, tokenType);
  const authToken = fastify.jwt.sign(payload, process.env.PASSWORD_RESET_TTL * 1000); // Expire token in 3 hours
  if(fastify.config.USE_JWT_REDIS) fastify.redis.set(`${type}:${userObj.id}`, true, 'EX', process.env.PASSWORD_RESET_TTL);
  return authToken;
};

module.exports = { generateToken };
