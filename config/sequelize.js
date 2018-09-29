'use strict';

module.exports = {
  // http://docs.sequelizejs.com/manual/installation/usage.html#options
  // support: mysql, mariadb, postgres, mssql
  dialect: process.env.CNPMJS_DIALECT || 'mysql',
  port: process.env.CNPMJS_DB_PORT || '3306',
  host: process.env.CNPMJS_DB_HOST || 'localhost',
  database: process.env.CNPMJS_DB_NAME || 'cnpm_registry_dev',
  username: process.env.CNPMJS_DB_USERNAME || 'root',
  password: process.env.CNPMJS_DB_PASSWORD || '',
  pool: {
    maxConnections: 10,
    minConnections: 0,
    maxIdleTime: 30000,
  },
  dialectOptions: {
    // trace: true,
  },
  define: {
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    // createdAt to actually be called gmt_create
    createdAt: 'gmt_create',
    // updatedAt to actually be called gmt_modified
    updatedAt: 'gmt_modified',
    charset: 'utf8mb4',
    // https://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
    collate: 'utf8mb4_unicode_ci',
  },
  // disable http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
  operatorsAliases: false,
};
