'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/package.test.js', () => {
  describe('GET /{package}', () => {
    it('should 422 when package name invalid', async () => {
      let res = await app.httpRequest()
        .get('/.foo');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with a period',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('    ')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: required',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('  \t\t\n\n\r\r  ')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: required',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('  \t\t\n\n\r\ra.\t.a.  ')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('?foo')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can\'t start with a question mark',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('&foo')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get('/!foo');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can\'t start with an exclamation point',
      });

      res = await app.httpRequest()
        .get('/|foo');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get('/@foo/~bar');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can no longer contain special characters ("~\'!()*")',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/_bar')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with an underscore',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo')}/.bar`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with a period',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/')}?bar`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/')}@bar`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/@${encodeURIComponent('foo/,bar')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/.bar/1.0.0')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/@${encodeURIComponent('foo/.bar/1.0.0')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });
    });

    it('should 200 on scoped package', async () => {
      let res = await app.httpRequest()
        .get('/@foo/bar');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/bar');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/-bar');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/@foo/-bar');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/@foo/bar/');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/@foo/bar?v=1');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/@foo/bar/?v=1');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/bar')}`);
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get(`/@${encodeURIComponent('foo/bar')}`);
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/@foo%2fbar');
      assert(res.status === 200);
    });
  });

  describe('GET /{package}/{version}', () => {
    it('should 422 when package name invalid', async () => {
      let res = await app.httpRequest()
        .get('/.foo/latest');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with a period',
      });

      res = await app.httpRequest()
        .get('/@foo/.bar/1.0.0');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with a period',
      });

      res = await app.httpRequest()
        .get('/@foo/_bar/1.0.0');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with an underscore',
      });
    });

    it('should 422 when version invalid', async () => {
      let res = await app.httpRequest()
        .get('/@foo%2fbar/ %20');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: required',
      });

      res = await app.httpRequest()
        .get('/@foo%2fbar/a');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: invalid version',
      });

      res = await app.httpRequest()
        .get('/@foo%2fbar/1.0');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: invalid version',
      });

      res = await app.httpRequest()
        .get('/@foo%2fbar/1');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: invalid version',
      });

      res = await app.httpRequest()
        .get('/@foo%2fbar/1.a');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: invalid version',
      });
    });

    it('should 200 on normal package', async () => {
      let res = await app.httpRequest()
        .get('/bar/1.0.0');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/bar/1.0.');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/bar/1.0.a');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });
    });

    it('should 200 on the latest normal package', async () => {
      const res = await app.httpRequest()
        .get('/bar/latest');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });
    });

    it('should 200 on the latest scoped package', async () => {
      const res = await app.httpRequest()
        .get('/@foo/bar/latest');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });
    });

    it('should 200 on scoped package', async () => {
      let res = await app.httpRequest()
        .get('/@foo/bar/1.0.0');
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/bar')}/1.0.0`);
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get(`/@${encodeURIComponent('foo/bar')}/1.0.0`);
      assert(res.status === 200);
      // assert.deepStrictEqual(res.body, {
      //   error: 'Not Found',
      // });

      res = await app.httpRequest()
        .get('/@foo%2fbar/latest');
      assert(res.status === 200);
    });
  });
});
