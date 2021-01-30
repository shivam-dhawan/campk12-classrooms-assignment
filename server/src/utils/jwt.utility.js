'use strict';
module.exports = (fastify) => {

  // const fs = require('fs');
  const jwt = require('jsonwebtoken');
  const uuid4 = require('uuid4');
  const modelConstants = require('../constants').modelConstants;

  // use 'utf8' to get string instead of byte array  (1024 bit key)
  // var publicKey = fs.readFileSync(__dirname + '/keys/public.key', 'utf8');
  // const privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
  const publicKey = fastify.config.JWT_SECRET_KEY;
  const privateKey = fastify.config.JWT_SECRET_KEY;

  var options = {
    issuer: fastify.config.APP_NAME,
    subject: `${fastify.config.APP_NAME}/token`,
    audience: `${fastify.config.APP_NAME}/app`,
    expiresIn: fastify.config.JWT_EXPIRY_TIME,
    algorithm: fastify.config.JWT_ALGORITHM
  };

  let decodeJWT = function (token) {
    return jwt.decode(token, publicKey, options);
  };

  let verifyJWT = async function (token) {
    let customOptions = {
      ...options,
      ignoreExpiration: fastify.config.DEBUG ? true : false
    };

    const responseData = jwt.verify(token, publicKey, customOptions);

    if (fastify.config.USE_JWT_REDIS) {
      let res = await fastify.redis.get(responseData.userId)
      if (!res) throw new fastify.errorCodes['EXPIRED_TOKEN']();
      if (res !== token) throw new fastify.errorCodes['INVALID_TOKEN']();
    }
    return responseData;
  };

  let generateJWT = function (payload, expiresIn) {
    let customOptions = { ...options };
    if (expiresIn) customOptions.expiresIn = expiresIn;
    let token = jwt.sign(payload, privateKey, customOptions);
    if (fastify.config.USE_JWT_REDIS) fastify.redis.set(payload.userId, token, 'EX', process.env.JWT_SESSION_REDIS_EXPIRY_TIME);
    return token;
  };

  let generatePayload = function (user, tokenType = modelConstants.TOKEN_TYPE_AUTH) {
    let userType = modelConstants.USER_TYPE_STR_MAPPER[user.constructor.modelName];
    let payload = {
      userId: user.id,
      userModel: user.constructor.modelName,
      userType: userType,
      tokenType: tokenType,
      sessionId: uuid4(),
      role: user.role,
    };
    return payload;
  };

  let requestVerify = async function (opts, next) {
    if (typeof opts === 'function' && !next) {
      next = opts;
      opts = Object.assign({}, options);
    } // support no options

    if (!opts) {
      opts = Object.assign({}, options);
    }

    const request = this;

    if (next === undefined) {
      return request.jwtVerify(opts, function (err, val) {
        err ? err : val;
      });
    }
    let payload;
    if (request.headers && request.headers.authorization) {
      const authToken = request.headers.authorization;
      try {
        payload = await verifyJWT(authToken);
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          throw new fastify.errorCodes['EXPIRED_TOKEN']();
        }
        if (err instanceof jwt.JsonWebTokenError) {
          throw new fastify.errorCodes['INVALID_TOKEN']();
        }
        throw err;
      }
    } else {
      throw new fastify.errorCodes['MISSING_TOKEN']();
    }
    request.user = payload;
    next();
  };

  let replySign = function (payload, opts, next) {
    if (typeof opts === 'function' && !next) {
      next = opts;
      opts = Object.assign({}, options);
    } // support no options

    if (!opts) {
      opts = Object.assign({}, options);
    }

    const reply = this;

    if (next === undefined) {
      return new Promise(function (resolve, reject) {
        reply.jwtSign(opts, function (err, val) {
          err ? reject(err) : resolve(val);
        });
      });
    }
    if (!payload) throw new fastify.errorCodes['PAYLOAD_REQUIRED']();
    generateJWT(payload);
    next();
  };


  return {
    verify: verifyJWT,
    decode: decodeJWT,
    sign: generateJWT,
    generatePayload,
    requestVerify,
    replySign,
  };

};
