'use strict';

const Controller = require('egg').Controller;

module.exports = class extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
};
