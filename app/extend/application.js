'use strict';

module.exports = {
  isPrivatePackage(name) {
    if (name[0] === '@') {
      const scope = name.split('/')[0];
      return this.config.scopes.includes(scope);
    }
    return this.config.privatePackages.includes(name);
  },
};
