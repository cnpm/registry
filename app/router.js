'use strict';

module.exports = app => {
  app.get('/', 'home.index');

  // /foo
  // /@foo/bar, /@foo%2Fbar, /%40foo%2Fbar, /%40foo/bar
  const PACKAGE_NAME_RE = /^\/((?:(?:@|%40)[^\/\%]{1,214}(?:\/|\%2F))?[^\/]{1,214})\/?$/i;

  // Package Endpoints
  // https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#package-endpoints
  // GET /{package}
  app.get(PACKAGE_NAME_RE, 'package.show');

  // GET /{package}/{version}
  app.get(/^\/((?:(?:@|%40)[^\/\%]{1,214}(?:\/|\%2F))?[^\/]{1,214})\/([^\/]{1,100})\/?$/i, 'package.showVersion');

  // PUT /{package}
  // publish a version of package
  app.put(PACKAGE_NAME_RE, 'package.publish');

  // GET /-/user/org.couchdb.user:{name}
  app.get('/-/user/org.couchdb.user::name', 'user.show');

  app.all('*', ctx => {
    throw ctx.notFoundError();
  });
};
