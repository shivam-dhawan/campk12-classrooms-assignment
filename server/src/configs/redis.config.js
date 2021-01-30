'use strict';

module.exports = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  db: process.env.REDIS_DB,
};
