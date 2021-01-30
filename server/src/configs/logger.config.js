'use strict';
const path = require('path');

let config = {
  serializers: {
    req: function asReqValue(req) {
      return {
        method: req.method,
        url: req.url,
        version: req.headers['accept-version'],
        hostname: req.hostname,
        remoteAddress: req.ip,
        remotePort: req.connection.remotePort
      };
    },
    res: function asResValue(res) {
      return {
        statusCode: res.statusCode,
      };
    }
  },
};

if (process.env.FILE_LOGGING_ENABLED == 'true') {
  config['file'] = path.join(__dirname, FILE_LOGGING_PATH); // will use pino.destination()
}

module.exports = config;
