'use strict';

// had enabled by egg
// exports.static = true;

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.parameters = {
  enable: true,
  package: 'egg-parameters',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};
