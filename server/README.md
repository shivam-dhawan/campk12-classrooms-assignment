# campk12-backend

**DIRECTORY DESCRIPTION:**
* _src_
  * _configs_ - Stores configuration for all plugins
  * _plugins_ - Custom plugins for fastify. Autoloaded using [`fastify-autoload`](https://github.com/fastify/fastify-autoload)
  * _schemas_ - Add schemas to routes for increased throughput and data serialization/validations. [REF](https://github.com/fastify/fastify/blob/master/docs/Validation-and-Serialization.md)
* _ecosystem.config.js_ - Ecosystem file for PM2. [REF](https://pm2.keymetrics.io/docs/usage/application-declaration/)

**NOTE: Project is using yarn2. Do not use NPM**