'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {
  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect(200);
  });

  it('should 404 when not match any router', () => {
    return app.httpRequest()
      .get('/@/@/@@')
      .expect(404)
      .expect({
        error: 'Not Found',
      });
  });
});
