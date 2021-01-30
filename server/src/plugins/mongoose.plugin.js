'use strict';

const fp = require('fastify-plugin');
const mongoose = require('mongoose');
function fastifyMongoose(fastify, options, done) {

  mongoose.Promise = global.Promise;
  let dbOptions = {
    dbName: process.env.MONGO_DATABASE_NAME,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: process.env.MONGO_POOL_SIZE || 10,
    autoReconnect: true,
    reconnectInterval: process.env.MONGO_RECONNECT_INTERVAL || 300,
    reconnectTries: process.env.MONGO_RECONNECT_TRIES || 10,
    autoIndex: eval(process.env.MONGOOSE_DEBUG),
  };
  mongoose.connect(process.env.MONGO_URI, dbOptions);

  const db = mongoose.connection;

  const mongo = {
    mongoose: mongoose,
    conn: db,
  };

  fastify
    .decorate('db', mongo)
    .addHook('onClose', function (fastify, done) {
      fastify.mongo.conn.close(done);
    });

  db.on('connected', function () {
    fastify.log.info({
      msg: `Mongo connection established at ${process.env.MONGO_URI}`,
      action: 'mongo-connected',
    });
  });

  db.on('error', function (error) {
    fastify.log.error({
      msg: `connection error at: ${process.env.MONGO_URI} error is: ${error.message}`,
      action: 'mongo-error',
      error: error
    });
  });

  // When the connection is disconnected
  db.on('disconnected', function () {
    fastify.log.info({
      msg: 'Mongo connection disconnected',
      action: 'mongo-disconnected'
    });
  });

  db.on('reconnectFailed', function (error) {
    db.close(function () {
      fastify.log.error({
        msg: `Reconnection failed at: ${process.env.MONGO_URI} error is: ${error.message}`,
        action: 'mongo-reconnectFailed',
        error: error
      });
      process.exit(0);
    });
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function () {
    db.close(function () {

      fastify.log.info({
        msg: 'Mongoose default connection disconnected through app termination',
        action: 'mongo-SIGINT-termination',
      });
      process.exit(0);
    });
  });
  done();

  mongoose.set('debug', (process.env.MONGOOSE_DEBUG === 'true') ? true : false);
}
module.exports = fp(fastifyMongoose);
