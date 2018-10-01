'use strict';

const Controller = require('egg').Controller;
const semver = require('semver');

module.exports = class extends Controller {
  // GET /{package}
  // https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#getpackage
  async show() {
    const { ctx } = this;
    const rawParams = { name: ctx.params[0] };
    const params = ctx.permitAndValidateParams({
      name: { type: 'packageName', trim: true },
    }, rawParams);

    const [ pkg, tags ] = await Promise.all([
      ctx.service.package.get(params.name),
      ctx.service.package.listAllTags(params.name),
    ]);
    if (!pkg || tags.length === 0) throw ctx.notFoundError();

    const distTags = {};
    for (const item of tags) {
      distTags[item.tag] = item.version;
    }

    const abbreviatedFormat = 'application/vnd.npm.install-v1+json';
    const needAbbreviatedFormat = ctx.accepts([ 'json', abbreviatedFormat ]) === abbreviatedFormat;
    if (needAbbreviatedFormat) {
      const versions = await ctx.service.package.listAllAbbreviatedVersions(pkg.name);
      if (versions.length === 0) throw ctx.notFoundError();
      // {
      //   "dist-tags": {
      //     "latest": "1.0.0"
      //   },
      //   "modified": "2015-05-16T22:27:54.741Z",
      //   "name": "tiny-tarball",
      //   "versions": {
      //     "1.0.0": {
      //       "_hasShrinkwrap": false,
      //       "directories": {},
      //       "dist": {
      //         "shasum": "bbf102d5ae73afe2c553295e0fb02230216f65b1",
      //         "tarball": "https://registry.npmjs.org/tiny-tarball/-/tiny-tarball-1.0.0.tgz"
      //        },
      //        "name": "tiny-tarball",
      //        "version": "1.0.0"
      //      }
      //   }
      // }
      const versionsMap = {};
      let modified = pkg.gmt_modified;
      for (const item of versions) {
        versionsMap[item.version] = item.package;
        // if version gmt_modified later then package gmt_modified, use it
        if (item.gmt_modified.getTime() > modified.getTime()) {
          modified = item.gmt_modified;
        }
      }

      ctx.body = {
        'dist-tags': distTags,
        modified,
        name: pkg.name,
        versions: versionsMap,
      };
      // koa will override json content-type, so should set content-type after body
      ctx.set('content-type', `${abbreviatedFormat}; charset=utf-8`);
      return;
    }

    // https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
    let [
      versions,
      maintainers,
      packageReadme,
    ] = await Promise.all([
      ctx.service.package.listAllVersions(pkg.name),
      ctx.service.package.listAllMaintainers(pkg.name),
      ctx.service.package.getVersionReadme(pkg.name, distTags.latest),
    ]);
    if (versions.length === 0) throw ctx.notFoundError();
    packageReadme = packageReadme || {};

    maintainers = maintainers.map(item => ({ name: item.name, email: item.email }));

    // "time": {
    //    "modified": "2015-05-16T22:27:54.741Z",
    //    "created": "2015-03-24T00:12:24.039Z",
    //    "1.0.0": "2015-03-24T00:12:24.039Z"
    //  },
    const time = {
      created: pkg.gmt_create,
      modified: pkg.gmt_modified,
    };
    const versionsMap = {};
    let maxVersion;
    let latestVersion;
    for (const item of versions) {
      // use the package version create time as publish time, because package has been published, it can't be change
      time[item.version] = item.gmt_create;
      versionsMap[item.version] = item.package;
      if (item.gmt_modified.getTime() > time.modified.getTime()) {
        time.modified = item.gmt_modified;
      }
      if (!maxVersion || semver.gt(item.version, maxVersion.version)) {
        maxVersion = item;
      }
      if (!latestVersion && item.version === distTags.latest) {
        latestVersion = item;
      }
    }

    if (!latestVersion) {
      // can't find the latest version item, use the maxVersion instead
      latestVersion = maxVersion;
      distTags.latest = latestVersion.version;
    }

    const author = latestVersion.package.author || { name: pkg.author };

    ctx.body = {
      _attachments: {},
      _id: pkg.name,
      _rev: `${pkg.id}`,
      author,
      description: pkg.description,
      'dist-tags': distTags,
      license: pkg.license,
      maintainers,
      name: pkg.name,
      readme: packageReadme.readme || '',
      readmeFilename: packageReadme.readme_filename || '',
      time,
      versions: versionsMap,
    };
  }

  // GET /{package}/{version}
  async showVersion() {
    const { ctx } = this;
    const rawParams = { name: ctx.params[0], version: ctx.params[1] };
    const params = ctx.permitAndValidateParams({
      name: { type: 'packageName', trim: true },
      version: { type: 'packageVersion', trim: true },
    }, rawParams);

    let version = params.version;
    if (version === 'latest') {
      const tag = await ctx.service.package.getTag(params.name, version);
      if (!tag) throw ctx.notFoundError();
      version = tag.version;
    }

    const row = await ctx.service.package.getVersion(params.name, version);
    if (!row) throw ctx.notFoundError();

    ctx.body = row.package;
  }
};
