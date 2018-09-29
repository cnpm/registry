'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = process.env.CNPMJS_KEYS || `${appInfo.name}_cnpm-registry-private-key`;

  // add your config here
  config.middleware = [];

  // database
  config.sequelize = require('./sequelize');

  return config;
};
