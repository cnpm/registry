'use strict';

const Service = require('egg').Service;

module.exports = class extends Service {
  async uploadBuffer(buffer, options) {
    return await this.app.nfs.uploadBuffer(buffer, options);
  }
};
