'use strict';

module.exports = app => {
  app.get('/', 'home.index');

  // Package Endpoints
  // https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#package-endpoints
  app.get('/:package', 'package.show');
};
