'use strict';

const BaseAppController = require('./base.controller.js');

class AdminController extends BaseAppController {
  constructor(model) {
    super(model);
  }
}

module.exports = AdminController;
