'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = process.env.CNPMJS_KEYS || `${appInfo.name}_cnpm-registry-private-key`;

  /**
   * registry mode config
   */

  // package tarball store in local filesystem by default
  config.nfs = {
    class: require('fs-cnpm'),
    options: {
      dir: path.join(appInfo.root, '.cnpmjs.org', 'nfs'),
    },
  };

  // default system admins
  config.admins = {
    // name: email
    admin: 'admin@registry.cnpmjs.org',
  };

  // enable private mode or not
  // private mode: only admins can publish, other users just can sync package from source npm
  // public mode: all users can publish
  config.enablePrivate = false;

  // registry scopes, if don't set, means do not support scopes
  config.scopes = [ '@cnpm', '@cnpmtest', '@cnpm-test' ];

  // some registry already have some private packages in global scope
  // but we want to treat them as scoped private packages,
  // so you can use this white list.
  config.privatePackages = [];

  // disable csrf
  config.security = {
    csrf: false,
  };

  // add your config here
  config.middleware = [
    'auth',
  ];

  // database
  config.sequelize = require('./sequelize');

  // egg-validate
  config.validate = {
    convert: true,
    // '' NaN null will regard as undefined
    widelyUndefined: true,
  };

  config.onerror = {
    // make sure all response return json
    accepts: () => 'json',
    // https://github.com/npm/registry/blob/master/docs/restful-api-conventions.md#common-responses
    // All errors should be in the form {message: 'error message'}. Internally, error responses should include a stack property.
    json(err) {
      const status = detectStatus(err);
      this.status = status;
      const body = {
        error: err.message,
      };
      this.body = body;
    },
    appErrorFilter(err) {
      const status = detectStatus(err);
      // ignore log client request error
      if (status < 500) return false;
      return true;
    },
  };

  return config;
};

function detectStatus(err) {
  // https://github.com/eggjs/egg-cancan/blob/master/app/extend/context.js#L5
  if (err.name === 'CanCanAccessDenied') return 403;
  if (err.status) return err.status;
  return 500;
}
