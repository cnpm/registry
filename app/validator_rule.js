'use strict';

const validatePackageName = require('validate-npm-package-name');

module.exports = app => {
  const { validator } = app;

  function _validatePackageName(value) {
    if (value.includes('%')) return 'name must not contain %';
    if (value[0] === '?') return 'name can\'t start with a question mark';
    if (value[0] === '!') return 'name can\'t start with an exclamation point';

    let result = validatePackageName(value);
    if (result.errors && result.errors.length > 0) {
      return result.errors.join('; ');
    }
    if (result.warnings && result.warnings.length > 0) {
      return result.warnings.join('; ');
    }
    if (value[0] === '@') {
      // scoped package, should check name again
      const pkg = value.split('/', 2)[1];
      if (pkg.includes('@')) return 'scoped package name must not contain @';
      result = validatePackageName(pkg);
      if (result.errors && result.errors.length > 0) {
        return result.errors.join('; ');
      }
      if (result.warnings && result.warnings.length > 0) {
        return result.warnings.join('; ');
      }
    }
  }

  // https://docs.npmjs.com/files/package.json#name
  // Some rules:
  // The name must be less than or equal to 214 characters. This includes the scope for scoped packages.
  // The name can't start with a dot or an underscore.
  // New packages must not have uppercase letters in the name.
  // The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.
  validator.addRule('packageName', (_, value) => {
    return _validatePackageName(value);
  }, false, 'string');

  validator.addRule('privatePackageName', (_, value) => {
    if (!app.isPrivatePackage(value)) return 'name must start with private scopes';
    return _validatePackageName(value);
  }, false, 'string');

  // valid version or latest
  const VERSION_RE = /^\d+?\.\d+?\./;
  validator.addRule('packageVersion', (_, value) => {
    if (value === 'latest') return;
    if (!VERSION_RE.test(value)) return 'invalid version';
  }, false, 'string');
};
