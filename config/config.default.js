'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_cnpm-registry-private-key';

  // add your config here
  config.middleware = [];

  // database
  config.sequelize = {
    dialect: process.env.CNPMJS_DIALECT || 'mysql',
    port: process.env.CNPMJS_DB_PORT || '3306',
    host: process.env.CNPMJS_DB_HOST || 'localhost',
    database: process.env.CNPMJS_DB_NAME || 'cnpmjs',
    username: process.env.CNPMJS_DB_USERNAME || 'cnpmjs',
    password: process.env.CNPMJS_DB_PASSWORD || 'cnpmjs',
  };

  return config;
};
