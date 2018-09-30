'use strict';

const validatePackageName = require('validate-npm-package-name');

module.exports = app => {
  const { validator } = app;

  validator.addRule('packageName', (rule, value) => {
    const result = validatePackageName(value);
    if (result.errors && result.errors.length > 0) {
      return result.errors.join('; ');
    }
    if (result.warnings && result.warnings.length > 0) {
      return result.warnings.join('; ');
    }
  }, false, 'string');
};
