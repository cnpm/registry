'use strict';

const utility = require('utility');
const Service = require('egg').Service;

module.exports = class extends Service {
  async create({ name, description, license, isPrivate = false }) {
    const { ctx } = this;
    return await ctx.model.Package.create({
      name,
      author: ctx.user.name,
      description,
      license,
      isPrivate,
    });
  }

  async get(name) {
    const { ctx } = this;
    return await ctx.model.Package.findOne({
      where: { name },
    });
  }

  async listAllTags(name) {
    const { ctx } = this;
    return await ctx.model.Tag.findAll({
      where: { name },
    });
  }

  async listAllVersions(name) {
    const { ctx } = this;
    return await ctx.model.ModuleVersion.findAll({
      where: { name },
    });
  }

  async listAllAbbreviatedVersions(name) {
    const { ctx } = this;
    return await ctx.model.ModuleAbbreviatedVersion.findAll({
      where: { name },
    });
  }

  async listAllMaintainers(name) {
    const { ctx } = this;
    const rows = await ctx.model.PrivatePackageMaintainer.findAll({
      where: { name },
    });
    const userNames = rows.map(row => row.user);
    return await ctx.model.User.findAll({
      where: {
        name: { [ctx.model.Op.in]: userNames },
      },
    });
  }

  async isMaintainer(name, userName) {
    const { ctx } = this;
    const row = await ctx.model.PrivatePackageMaintainer.findOne({
      where: { user: userName, name },
    });
    return !!row;
  }

  async getVersionReadme(name, version) {
    const { ctx } = this;
    return await ctx.model.ModuleVersionReadme.findOne({
      where: { name, version },
    });
  }

  _formatCDNKey(name, filename) {
    // if name is scope package name, need to auto fix filename as a scope package file name
    // e.g.: @scope/foo, filename: foo-1.0.0.tgz => filename: @scope/foo-1.0.0.tgz
    if (name[0] === '@' && filename[0] !== '@') {
      filename = name.split('/')[0] + '/' + filename;
    }
    return '/' + name + '/-/' + filename;
  }

  async saveVersion(pkg, versionPackage, tags, attachment) {
    const { ctx } = this;
    const name = versionPackage.name;
    if (!pkg) {
      pkg = await this.create({
        name,
        license: versionPackage.license,
        description: versionPackage.description,
        isPrivate: true,
      });
    }

    let hasLatestTag = false;
    for (const item of tags) {
      if (item.tag === 'latest') {
        hasLatestTag = true;
        break;
      }
    }

    if (!hasLatestTag) {
      // need to check if latest tag exists or not
      const latest = await this.getTag(name, 'latest');
      if (!latest) {
        // auto add latest
        tags.push({ tag: 'latest', version: versionPackage.version });
      }
    }

    const shasum = utility.sha1(attachment.buffer);
    const shasum256 = utility.sha256(attachment.buffer);

    const options = {
      key: this._formatCDNKey(name, attachment.filename),
      size: attachment.buffer.length,
      shasum,
      shasum256,
    };
    const uploadResult = await ctx.service.nfs.uploadBuffer(attachment.buffer, options);

    const dist = {
      shasum,
      shasum256,
      size: attachment.buffer.length,
    };

    // if nfs upload return a key, record it
    if (uploadResult.url) {
      dist.tarball = uploadResult.url;
    } else if (uploadResult.key) {
      dist.key = uploadResult.key;
      dist.tarball = uploadResult.key;
    } else {
      // no uploadResult.url and uploadResult.key
      throw new Error('nfs.uploadBuffer result format error, required url or key');
    }
    ctx.logger.info('[service.package.saveVersion:uploadBuffer:success] %j', uploadResult);

    versionPackage.dist = dist;
    const info = {
      name,
      version: versionPackage.version,
      description: versionPackage.description,
      author: ctx.user.name,
      package: versionPackage,
    };

    const row = await ctx.model.ModuleVersion.create(info);
    ctx.logger.info('[service.package.saveVersion:success] %s: save file to %s, size: %d, sha1: %s, dist: %j, version: %s',
      row.id, dist.tarball, dist.size, shasum, dist, versionPackage.version);

    await this._addTags(name, tags);

    // ensure maintainers exists
    const maintainers = versionPackage.maintainers.map(item => item.name);
    await this.addPrivatePackageMaintainers(name, maintainers);

    // allow fails
    try {
      await this._addDependencies(versionPackage);
    } catch (err) {
      ctx.logger.error('[service.package.saveVersion] _addDependencies error: %s', err);
      ctx.logger.error(err);
    }
    return row;
  }

  async addPrivatePackageMaintainers(name, users) {
    return await this._addPackageMaintainers(true, name, users);
  }

  async addPublishPackageMaintainers(name, users) {
    return await this._addPackageMaintainers(false, name, users);
  }

  async _addPackageMaintainers(isPrivate, name, users) {
    const tasks = [];
    for (const user of users) {
      tasks.push(this._addPackageMaintainer(isPrivate, name, user));
    }
    return await Promise.all(tasks);
  }

  async _addPackageMaintainer(isPrivate, name, user) {
    const { ctx } = this;
    const PackageMaintainer = isPrivate ? ctx.model.PrivatePackageMaintainer : ctx.model.PublicPackageMaintainer;
    const row = await PackageMaintainer.findOne({
      where: { name, user },
    });
    if (row) return row;
    return await PackageMaintainer.create({ name, user });
  }

  async _addDependencies(versionPackage) {
    const dependencies = Object.keys(versionPackage.dependencies || {});
    const len = dependencies.length > 200 ? 200 : dependencies.length;
    const tasks = [];
    for (let i = 0; i < len; i++) {
      tasks.push(this._addDependency(versionPackage.name, dependencies[i]));
    }
    return await Promise.all(tasks);
  }

  // name => dependency
  async _addDependency(name, dependency) {
    const { ctx } = this;
    const row = await ctx.model.ModuleDependency.findOne({
      where: {
        name: dependency,
        dependent: name,
      },
    });
    if (row) return row;

    return await ctx.model.ModuleDependency.create({
      name: dependency,
      dependent: name,
    });
  }

  async getVersion(name, version) {
    const { ctx } = this;
    return await ctx.model.ModuleVersion.findOne({
      where: { name, version },
    });
  }

  async getTag(name, tag) {
    const { ctx } = this;
    return await ctx.model.Tag.findOne({
      where: { name, tag },
    });
  }

  async _addTags(name, tags) {
    const tasks = [];
    for (const tag of tags) {
      tasks.push(this.addTag(name, tag.tag, tag.version));
    }
    await Promise.all(tasks);
  }

  async addTag(name, tag, version) {
    const { ctx } = this;
    const row = await ctx.model.Tag.findOne({
      where: { name, tag },
    });
    if (row) {
      if (row.version !== version) {
        row.version = version;
        await row.save();
      }
      return row;
    }
    return await ctx.model.Tag.create({ name, tag, version });
  }

  async deprecateVersions(pkg, versions) {
    const { ctx } = this;
    for (const { version, deprecated } of versions) {
      const row = await ctx.service.package.getVersion(pkg.name, version);
      if (!row) {
        throw ctx.badRequestError(`${pkg.name}@${version} is not exists`);
      }
      await row.updatePackage({ deprecated });
    }
    // update last modified
    pkg.gmt_modified = new Date();
    await pkg.save();
  }
};
