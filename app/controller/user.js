'use strict';

const Controller = require('egg').Controller;

module.exports = class extends Controller {
  // GET /-/user/org.couchdb.user:{name}
  async show() {
    const { ctx } = this;
    const params = ctx.permitAndValidateParams({
      name: { type: 'string', trim: true, max: 100 },
    }, ctx.params);

    console.log(params);

    ctx.body = params;
  }
};
