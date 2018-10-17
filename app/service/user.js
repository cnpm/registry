'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');
const utility = require('utility');

module.exports = class extends Service {
  // async get(name) {
  //
  // }

  async create(name, email, password) {
    const { ctx } = this;
    const row = await ctx.model.User.findOne({
      where: { name },
    });
    if (row) {
      const err = new Error('user already exists');
      throw err;
    }

    const passwordInfo = protectPassword(password);
    const user = {
      name,
      email,
      ip: ctx.ip,
      ...passwordInfo,
    };
    return await ctx.model.User.create(user);
  }

  async auth(name, password, email) {
    const { ctx } = this;
    // need to support old sha1 and new sha256
    // 64 len is sha256

    // TODO: customUserService plugin
    if (ctx.app.config.customUserService) {
      return await ctx.customUserService.auth(name, password, email);
    }

    const row = await ctx.model.User.findOne({
      where: { name },
    });
    if (!row) return null;
    const { passwordSha } = protectPassword(password, row.salt);
    if (passwordSha !== row.passwordSha) return null;
    return row;
  }
};

function protectPassword(password, salt) {
  // only store sha256 password hash on server
  salt = salt || crypto.randomBytes(30).toString('hex');
  const passwordSha = utility.sha256(password + salt);
  return {
    salt,
    passwordSha,
  };
}
