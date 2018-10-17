'use strict';

const { app, assert, mock } = require('egg-mock/bootstrap');

describe('test/app/middleware/auth.test.js', () => {
  describe('config.customUserService = false', () => {
    it('should pass if no authorization', async () => {
      const ctx = app.mockContext();
      await ctx.service.user.create('cnpmjstest10', 'cnpmjstest10@mock.com', '123123');
      const res = await app.httpRequest()
        .get('/-/user/org.couchdb.user:cnpmjstest10');
      assert(res.status === 200);
    });

    it('should pass when authorization success', async () => {
      const ctx = app.mockContext();
      await ctx.service.user.create('cnpmjstest10', 'cnpmjstest10@mock.com', '123123');
      const res = await app.httpRequest()
        .get('/-/user/org.couchdb.user:cnpmjstest10')
        .set('authorization', 'basic ' + Buffer.from('cnpmjstest10:123123').toString('base64'));
      assert(res.status === 200);
    });

    it('should 401 when authorization fail', async () => {
      const ctx = app.mockContext();
      await ctx.service.user.create('cnpmjstest10', 'cnpmjstest10@mock.com', '123123');
      const res = await app.httpRequest()
        .get('/-/user/org.couchdb.user:cnpmjstest10')
        .set('authorization', 'basic ' + Buffer.from('cnpmjstest10:456456').toString('base64'));
      assert(res.status === 401);
      assert(res.body.error === 'Unauthorized');
    });

    it('should 401 when authorization header format fail', async () => {
      const ctx = app.mockContext();
      await ctx.service.user.create('cnpmjstest10', 'cnpmjstest10@mock.com', '123123');
      const res = await app.httpRequest()
        .get('/-/user/org.couchdb.user:cnpmjstest10')
        .set('authorization', 'basic ' + Buffer.from('cnpmjstest10123123').toString('base64'));
      assert(res.status === 401);
      assert(res.body.error === 'Unauthorized');
    });

    it('should pass with authorization (password contains ":") and check ok', async () => {
      const ctx = app.mockContext();
      await ctx.service.user.create('cnpmjstest10', 'cnpmjstest10@mock.com', 'cnpmjs:test104');
      const res = await app.httpRequest()
        .get('/-/user/org.couchdb.user:cnpmjstest10')
        .set('authorization', 'basic ' + Buffer.from('cnpmjstest10:cnpmjs:test104').toString('base64'));
      assert(res.status === 200);
    });
  });

  // describe('config.customUserService = true', () => {
  //   beforeEach(() => {
  //     mm(config, 'customUserService', true);
  //   });
  //
  //   it('should 401 when user service auth throw error', async () => {
  //     mm(userService, 'auth', function* () {
  //       var err = new Error('mock user service auth error, please visit http://ooxx.net/user to sigup first');
  //       err.name = 'UserSeriveAuthError';
  //       err.status = 401;
  //       throw err;
  //     });
  //
  //     const res = await app.httpRequest()
  //     .put('/-/user/org.couchdb.user:cnpmjstest10/-rev/1')
  //     .set('authorization', 'basic ' + Buffer.from('cnpmjstest10:cnpmjstest10').toString('base64'))
  //     .expect({
  //       error: 'UserSeriveAuthError',
  //       reason: 'mock user service auth error, please visit http://ooxx.net/user to sigup first'
  //     })
  //     .expect(401, done);
  //   });
  // });

  describe('config.alwaysAuth = true', () => {
    beforeEach(() => {
      mock(app.config, 'alwaysAuth', true);
    });

    it('should required auth for every request', async () => {
      const res = await app.httpRequest()
        .get('/')
        .set('Accept', 'application/json');
      assert(res.status === 401);
      assert(res.body.error === 'Unauthorized');
    });
  });
});
