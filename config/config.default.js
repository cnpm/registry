'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = process.env.CNPMJS_KEYS || `${appInfo.name}_cnpm-registry-private-key`;

  // add your config here
  config.middleware = [];

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
    json(err) {
      const status = err.status || 500;
      this.status = status;
      const body = {
        code: err.code,
        error: err.message,
      };
      this.body = body;
    },
  };

  return config;
};
