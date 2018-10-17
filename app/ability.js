'use strict';

const { BaseAbility } = require('egg-cancan');

module.exports = class extends BaseAbility {
  async rules(action, obj, options = {}) {
    const { type } = options;

    if (type === 'package') {
      if (action === 'publish') {
        return await this.canPublishPackage(obj);
      }
      if (action === 'add_maintainer') {
        if (this.ctx.isAdmin) return true;
        return await this.canPublishPackage(obj);
      }
    }

    return false;
  }

  async canPublishPackage(pkg) {
    const { ctx } = this;
    if (!ctx.user) return false;

    if (await ctx.service.package.isMaintainer(pkg.name, ctx.user.name)) return true;
    return false;
  }
};
