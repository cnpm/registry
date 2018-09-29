'use strict';

const utility = require('utility');
const utils = require('../utils/model_utils');

/*
CREATE TABLE IF NOT EXISTS `user` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(100) NOT NULL COMMENT 'user name',
 `salt` varchar(100) NOT NULL COMMENT 'user salt',
 `password_sha` varchar(100) NOT NULL COMMENT 'user password hash',
 `ip` varchar(64) NOT NULL COMMENT 'user last request ip',
 `roles` varchar(200) NOT NULL DEFAULT '[]' COMMENT 'user roles',
 `rev` varchar(40) NOT NULL COMMENT 'user rev',
 `email` varchar(400) NOT NULL COMMENT 'user email',
 `json` longtext COMMENT 'json details',
 `npm_user` tinyint(1) DEFAULT '0' COMMENT 'user sync from npm or not, 1: true, other: false',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name` (`name`),
 KEY `idx_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='user base info';
*/

module.exports = app => {
  const { BIGINT, STRING, BOOLEAN, TEXT, DATE } = app.Sequelize;

  const Model = app.model.define('User', {
    id: {
      type: BIGINT(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    gmt_create: {
      type: DATE(6),
      allowNull: false,
    },
    gmt_modified: {
      type: DATE(6),
      allowNull: false,
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'user name',
    },
    salt: {
      type: STRING(100),
      allowNull: false,
    },
    password_sha: {
      type: STRING(100),
      allowNull: false,
      comment: 'user password hash',
    },
    ip: {
      type: STRING(64),
      allowNull: false,
      comment: 'user last request ip',
    },
    roles: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '[]',
    },
    rev: {
      type: STRING(40),
      allowNull: false,
    },
    email: {
      type: STRING(400),
      allowNull: false,
    },
    json: {
      type: TEXT('long'),
      allowNull: true,
      get: utils.JSONGetter('json'),
      set: utils.JSONSetter('json'),
    },
    // `npm_user` TINYINT(1) NOT NULL DEFAULT false
    isNpmUser: {
      field: 'npm_user',
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'user sync from npm or not, 1: true, other: false',
    },
  }, {
    tableName: 'user',
    comment: 'user base info',
    indexes: [
      {
        name: 'uk_name',
        unique: true,
        fields: [ 'name' ],
      },
      {
        name: 'idx_gmt_modified',
        fields: [ 'gmt_modified' ],
      },
    ],
  });

  Object.assign(Model, {
    // utils
    createPasswordSha(password, salt) {
      return utility.sha1(password + salt);
    },

    // read
    async auth(name, password) {
      let user = await this.findByName(name);
      if (user) {
        const sha = this.createPasswordSha(password, user.salt);
        if (user.password_sha !== sha) {
          user = null;
        }
      }
      return user;
    },

    async findByName(name) {
      return await this.find({ where: { name } });
    },

    async listByNames(names) {
      if (!names || names.length === 0) {
        return [];
      }
      return await this.findAll({
        where: {
          name: {
            in: names,
          },
        },
      });
    },

    async search(query, options) {
      return await this.findAll({
        where: {
          name: {
            like: query + '%',
          },
        },
        limit: options.limit,
      });
    },

    // write
    async saveNpmUser(data) {
      let user = await this.findByName(data.name);
      if (!user) {
        user = this.build({
          isNpmUser: true,
          name: data.name,
          salt: '0',
          password_sha: '0',
          ip: '0',
        });
      }
      user.isNpmUser = true;
      user.json = data;
      user.email = data.email || '';
      user.rev = data._rev || '';
      if (user.changed()) {
        user = await user.save();
      }
      return user;
    },

    async saveCustomUser(data) {
      const name = data.user.login;
      let user = await this.findByName(name);
      if (!user) {
        user = this.build({
          isNpmUser: false,
          name,
        });
      }

      const rev = '1-' + data.user.login;
      const salt = data.salt || '0';
      const passwordSha = data.password_sha || '0';
      const ip = data.ip || '0';

      user.isNpmUser = false;
      user.email = data.user.email;
      user.ip = ip;
      user.json = data.user;
      user.rev = rev;
      user.salt = salt;
      user.password_sha = passwordSha;

      if (user.changed()) {
        user = await user.save();
      }
      return user;
    },

    // add cnpm user
    async add(user) {
      let roles = user.roles || [];
      try {
        roles = JSON.stringify(roles);
      } catch (e) {
        roles = '[]';
      }
      const rev = '1-' + utility.md5(JSON.stringify(user));

      const row = this.build({
        rev,
        name: user.name,
        email: user.email,
        salt: user.salt,
        password_sha: user.password_sha,
        ip: user.ip,
        roles,
        isNpmUser: false,
      });

      return await row.save();
    },

    async update(user) {
      const rev = user.rev || user._rev;
      let revNo = Number(rev.split('-', 1));
      if (!revNo) {
        const err = new Error(rev + ' format error');
        err.name = 'RevFormatError';
        err.data = { user };
        throw err;
      }
      revNo++;
      const newRev = revNo + '-' + utility.md5(JSON.stringify(user));
      let roles = user.roles || [];
      try {
        roles = JSON.stringify(roles);
      } catch (e) {
        roles = '[]';
      }

      const row = await this.findByName(user.name);
      if (!row) {
        return null;
      }

      row.rev = newRev;
      row.email = user.email;
      row.salt = user.salt;
      row.password_sha = user.password_sha;
      row.ip = user.ip;
      row.roles = roles;
      row.isNpmUser = false;

      return await row.save([
        'rev', 'email', 'salt', 'password_sha', 'ip', 'roles', 'isNpmUser',
      ]);
    },
  });

  return Model;
};
