'use strict';

const utils = require('../utils/model_utils');

/*
CREATE TABLE IF NOT EXISTS `user` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(100) NOT NULL COMMENT 'user name',
 `salt` varchar(100) NOT NULL COMMENT 'user salt',
 `password_sha` varchar(100) NOT NULL COMMENT 'user password hash, 64 len is sha256, 40 len is sha1',
 `ip` varchar(64) NOT NULL COMMENT 'user last request ip',
 `roles` varchar(200) NOT NULL DEFAULT '[]' COMMENT 'user roles',
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
    passwordSha: {
      field: 'password_sha',
      type: STRING(100),
      allowNull: false,
      comment: 'user password hash, 64 len is sha256, 40 len is sha1',
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

  return Model;
};
