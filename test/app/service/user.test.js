'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/user.test.js', () => {
  describe('create()', () => {
    it('should create new user', async () => {
      const ctx = app.mockContext();
      const user = await ctx.service.user.create('mockuser', 'mockuser@mock.com', '123123');
      assert(user);
      assert(user.name === 'mockuser');
      assert(user.salt.length === 60);
      assert(user.passwordSha.length === 64);
      assert(user.isNpmUser === false);
    });
  });
});
