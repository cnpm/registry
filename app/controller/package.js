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

  // PUT /{package}
  // 'dist-tags': { latest: '0.0.2' },
  //  _attachments:
  // { 'nae-sandbox-0.0.2.tgz':
  //    { content_type: 'application/octet-stream',
  //      data: 'H4sIAAAAA
  //      length: 9883
  async publish() {
    const { ctx } = this;
    ctx.requireUser();
    if (ctx.app.config.enablePrivate) ctx.requireAdmin();

    const rawParams = { name: ctx.params[0] };
    const params = ctx.permitAndValidateParams({
      name: { type: 'privatePackageName', trim: true },
    }, rawParams);
    const data = ctx.request.body;
    Object.assign(data, params);

    const pkg = await ctx.service.package.get(data.name);
    if (pkg) await ctx.authorize('publish', pkg, { type: 'package' });

    const attachments = data._attachments || {};
    const versions = data.versions || {};
    let filename = Object.keys(attachments)[0];
    if (filename) filename = filename.trim();
    let version = Object.keys(versions)[0];
    if (version) version = version.trim();

    if (!version) throw ctx.badRequestError('versions is empty');

    // deprecated package versions
    if (!filename) {
      const deprecatedVersions = [];
      for (const v in versions) {
        const row = versions[v];
        if (typeof row.deprecated === 'string') {
          row.version = v;
          deprecatedVersions.push(row);
        }
      }
      if (deprecatedVersions.length === 0) throw ctx.badRequestError('_attachments is empty');
      if (!pkg) throw ctx.badRequestError(`${data.name} is not exists`);

      await ctx.service.package.deprecateVersions(pkg, deprecatedVersions);
      ctx.body = { ok: true };
      return;
    }

    const attachment = attachments[filename];
    attachment.filename = filename;
    const versionPackage = versions[version];
    versionPackage.name = data.name;
    const maintainers = versionPackage.maintainers || [];
    versionPackage.maintainers = maintainers;

    // should never happened in normal request
    if (maintainers.length === 0) {
      throw ctx.badRequestError('maintainers is empty');
    }

    // notice that admins can not publish to all modules
    // (but admins can add self to maintainers first)

    // make sure user in auth is in maintainers
    // should never happened in normal request
    let currentUserInMaintainers = false;
    for (const maintainer of maintainers) {
      if (maintainer.name === ctx.user.name) {
        currentUserInMaintainers = true;
        break;
      }
    }
    if (!currentUserInMaintainers) {
      throw ctx.badRequestError(`${ctx.user.name} does not in maintainer list`);
    }

    versionPackage._publish_on_cnpm = true;
    const distTags = data['dist-tags'] || {};
    const tags = []; // tag, version
    for (const tag in distTags) {
      tags.push({
        tag,
        version: distTags[tag],
      });
    }

    if (tags.length === 0) {
      throw ctx.badRequestError('dist-tags is empty');
    }

    if (await ctx.service.package.getVersion(data.name, version)) {
      throw ctx.badRequestError(`cannot modify pre-existing version: ${version}`);
    }

    // upload attachment
    attachment.buffer = Buffer.from(attachment.data, 'base64');

    if (attachment.buffer.length !== attachment.length) {
      throw ctx.badRequestError(`Attachment size ${attachment.length} not match download size ${attachment.buffer.length}`);
    }

    ctx.logger.info('%s publish new %s:%s, attachment size: %s, maintainers: %j, tags: %j',
      ctx.user.name, data.name, version, attachment.length, maintainers, tags);

    const row = await ctx.service.package.saveVersion(pkg, versionPackage, tags, attachment);

    ctx.status = 201;
    ctx.body = {
      ok: true,
      rev: String(row.id),
    };

    // hooks
    // const envelope = {
    //   event: 'package:publish',
    //   name: versionPackage.name,
    //   type: 'package',
    //   version: versionPackage.version,
    //   hookOwner: null,
    //   payload: null,
    //   change: null,
    // };
    // hook.trigger(envelope);
  }
};
