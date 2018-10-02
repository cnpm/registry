'use strict';

const Service = require('egg').Service;

module.exports = class extends Service {
  async get(name) {
    const { ctx } = this;
    return await ctx.model.Package.findOne({
      where: { name },
    });
  }

  async listAllTags(name) {
    const { ctx } = this;
    return await ctx.model.Tag.findAll({
      where: { name },
    });
  }

  async listAllVersions(name) {
    const { ctx } = this;
    return await ctx.model.ModuleVersion.findAll({
      where: { name },
    });
  }

  async listAllAbbreviatedVersions(name) {
    const { ctx } = this;
    return await ctx.model.ModuleAbbreviatedVersion.findAll({
      where: { name },
    });
  }

  async listAllMaintainers(name) {
    const { ctx } = this;
    const rows = await ctx.model.ModuleMaintainer.findAll({
      where: { name },
    });
    const userNames = rows.map(row => row.user);
    return await ctx.model.User.findAll({
      where: {
        name: { [ctx.model.Op.in]: userNames },
      },
    });
  }

  async getVersionReadme(name, version) {
    const { ctx } = this;
    return await ctx.model.ModuleVersionReadme.findOne({
      where: { name, version },
    });
  }

  async saveVersion(pkg) {

  }

  async getVersion(name, version) {
    const { ctx } = this;
    return await ctx.model.ModuleVersion.findOne({
      where: { name, version },
    });
  }

  async getTag(name, tag) {
    const { ctx } = this;
    return await ctx.model.Tag.findOne({
      where: { name, tag },
    });
  }
};
