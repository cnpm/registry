'use strict';

module.exports = {
  development: {
    ...require('../config/sequelize'),
    logging: console.log,
    dialectOptions: {
      // migration need to execute multi sqls
      multipleStatements: true,
    },
  },
  test: {
    ...require('../config/sequelize'),
    database: 'cnpm_registry_unittest',
    logging: console.log,
    dialectOptions: {
      // migration need to execute multi sqls
      multipleStatements: true,
    },
  },
  // don't use on production
  // production: require('../config/sequelize'),
};
