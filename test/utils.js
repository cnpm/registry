'use strict';

const path = require('path');
const fs = require('fs');

const fixtures = path.join(__dirname, 'fixtures');
const packageJSONBuffer = fs.readFileSync(path.join(fixtures, 'package_and_tgz.json'));

module.exports = {
  getPackage(name, version, user, tag, readme) {
    name = name || 'unittest-pkg';
    version = version || '1.0.0';
    user = user || 'admin';
    tag = tag || 'latest';
    const tags = {};
    tags[tag] = version;

    const pkg = JSON.parse(packageJSONBuffer);
    const versions = pkg.versions;
    pkg.versions = {};
    pkg.versions[version] = versions[Object.keys(versions)[0]];
    pkg.maintainers[0].name = user;
    pkg.versions[version].maintainers[0].name = user;
    pkg.versions[version].name = name;
    pkg.versions[version].version = version;
    pkg.versions[version]._id = name + '@' + version;
    pkg.name = name;
    pkg['dist-tags'] = tags;
    if (readme) {
      pkg.versions[version].readme = pkg.readme = readme;
    }
    return pkg;
  },
};
