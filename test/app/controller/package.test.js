'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/package.test.js', () => {
  describe('GET /{package}', () => {
    it('should 422 when package name invalid', async () => {
      const res = await app.httpRequest()
        .get('/.foo');
      assert(res.status === 422);
      console.log(res.text);
      assert.deepStrictEqual(res.body, {
        code: 'invalid',
        error: 'package: name cannot start with a period',
      });
    });
  });
});
