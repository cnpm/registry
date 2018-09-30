'use strict';

const Controller = require('egg').Controller;

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
    if (!pkg || tags.length === 0) throw ctx.notFound();

    const distTags = {};
    for (const item of tags) {
      distTags[item.tag] = item.version;
    }

    const abbreviatedMetaType = 'application/vnd.npm.install-v1+json';
    const needAbbreviatedFormat = ctx.accepts([ 'json', abbreviatedMetaType ]) === abbreviatedMetaType;
    if (needAbbreviatedFormat) {
      const versions = await ctx.service.package.listAllAbbreviatedVersions(pkg.name);
      if (versions.length > 0) throw ctx.notFoundError();
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
      for (const item of versions) {
        versionsMap[item.version] = item;
      }

      ctx.body = {
        'dist-tag': distTags,
        modified: pkg.gmt_modified,
        name: pkg.name,
        versions: versionsMap,
      };
      return;
    }

    // https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
    let [
      versions,
      maintainers,
      packageReadme,
      author,
    ] = await Promise.all([
      ctx.service.package.listAllAbbreviatedVersions(pkg.name),
      ctx.service.package.listAllMaintainers(pkg.name),
      ctx.service.package.getVersionReadme(pkg.name, distTags.latest),
      ctx.service.user.get(pkg.author),
    ]);
    if (versions.length === 0) throw ctx.notFoundError();

    author = author || { author: pkg.author };
    packageReadme = packageReadme || {};

    // "time": {
    //     "1.0.0": "2015-03-24T00:12:24.039Z",
    //     "created": "2015-03-24T00:12:24.039Z",
    //     "modified": "2015-05-16T22:27:54.741Z"
    // },
    const time = {};
    for (const item of versions) {
      time[item.version] = item.gmt_modified;
    }
    time.created = pkg.gmt_create;
    time.modified = pkg.gmt_modified;

    ctx.body = {
      _attachments: {},
      _id: pkg.name,
      _rev: `${pkg.id}`,
      author: {
        email: author.email,
        name: author.name,
      },
      description: pkg.description,
      'dist-tags': distTags,
      license: pkg.license,
      maintainers,
      name: pkg.name,
      readme: packageReadme.readme || '',
      readmeFilename: packageReadme.readme_filename || '',
      time,
      versions,
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

    ctx.body = row;
  }
};
