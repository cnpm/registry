'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  up: async queryInterface => {
    const sql = fs.readFileSync(path.join(__dirname, 'init-tables.sql'), 'utf8');
    await queryInterface.sequelize.query(sql, { raw: true });
  },

  down: async queryInterface => {
    await queryInterface.dropAllTables();
  },
};
