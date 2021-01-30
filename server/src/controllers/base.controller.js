'use strict';

/**
 * The App controller class where other controller inherits or
 * overrides pre defined and existing properties
 */
class BaseAppController {
  /**
   * @param {Model} model The default model object
   * for the controller. Will be required to create
   * an instance of the controller
   */
  constructor(model) {
    this._model = model;

    this.getList = this.getList.bind(this);
    this.createObj = this.createObj.bind(this);
    this.getObj = this.getObj.bind(this);
    this.updateObj = this.updateObj.bind(this);
    this.deleteObj = this.deleteObj.bind(this);
    this.getPaginatedList = this.getPaginatedList.bind(this);
  }

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {Object} res The response object
   */

  async getList(request, reply) {
    try {
      let data = await this._model.getList(request.query);
      fastify.okResponse(request, reply, data);
    } catch (err) {
      throw err;
    }
  }

  async createObj(request, reply) {
    try {
      let data = await this._model.createObj(request.body);
      fastify.okResponse(request, reply, data);
    } catch (err) {
      throw err;
    }
  }

  async getObj(request, reply) {
    try {
      const data = await this._model.getObjByQuery({ _id: request.params.id, ...request.query });
      if (!data) throw new fastify.errorCodes['NOT_FOUND'](this._model.modelName);
      fastify.okResponse(request, reply, data);
    } catch (err) {
      throw err;
    }
  }

  async updateObj(request, reply) {
    try {
      const data = await this._model.updateObjByQuery({ _id: request.params.id, ...request.query }, request.body);
      if (!data) throw new fastify.errorCodes['NOT_FOUND'](this._model.modelName);
      fastify.okResponse(request, reply, data);
    } catch (err) {
      throw err;
    }
  }

  async deleteObj(request, reply) {
    try {
      const data = await this._model.deleteObjByQuery({ _id: request.params.id, ...request.query });
      if (!data) throw new fastify.errorCodes['NOT_FOUND'](this._model.modelName);
      fastify.okResponse(request, reply, data);
    } catch (err) {
      throw err;
    }
  }

  async getPaginatedList(request, reply) {
    try {
      let data = await this._model.getPaginatedList(request.query);
      fastify.okResponse(request, reply, data);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BaseAppController;
