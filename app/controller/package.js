'use strict';

const Controller = require('egg').Controller;

module.exports = class extends Controller {
  // GET /{package}
  // https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#getpackage
  async show() {
    const { ctx } = this;
    const params = ctx.permitAndValidateParams({
      package: 'packageName',
    });
    ctx.body = {
      params,
    };
  }
};
