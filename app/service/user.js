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
    const passwordInfo = protectPassword(password);
    const user = {
      name,
      email,
      ip: ctx.ip,
      ...passwordInfo,
    };
    return await ctx.model.User.create(user);
  }

  // async auth(name, email, password) {
  //   // need to support old sha1 and new sha256
  // }
};

function protectPassword(password) {
  // only store sha256 password hash on server
  const salt = crypto.randomBytes(30).toString('hex');
  const passwordSha = utility.sha256(password + salt);
  return {
    salt,
    passwordSha,
  };
}
