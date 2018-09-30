'use strict';

module.exports = app => {
  app.get('/', 'home.index');

  // Package Endpoints
  // https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#package-endpoints
  // GET /{package}
  app.get(/^\/((?:(?:@|%40)[^\/\%]{1,214}(?:\/|\%2F))?[^\/]{1,214})\/?$/i, 'package.show');

  // GET /{package}/{version}
  app.get(/^\/((?:(?:@|%40)[^\/\%]{1,214}(?:\/|\%2F))?[^\/]{1,214})\/([^\/]{1,100})\/?$/i, 'package.showVersion');

  app.all('*', ctx => {
    throw ctx.notFoundError();
  });
};
