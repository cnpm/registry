'use strict';

const utils = require('../utils/model_utils');

/*
CREATE TABLE IF NOT EXISTS `module` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `author` varchar(100) NOT NULL COMMENT 'module author',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `version` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module version',
 `description` longtext COMMENT 'module description',
 `package` longtext COMMENT 'package.json',
 `dist_shasum` varchar(100) DEFAULT NULL COMMENT 'module dist SHASUM',
 `dist_tarball` varchar(2048) DEFAULT NULL COMMENT 'module dist tarball',
 `dist_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'module dist size',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name_version` (`name`,`version`),
 KEY `idx_gmt_modified` (`gmt_modified`),
 KEY `idx_gmt_create` (`gmt_create`),
 KEY `idx_author` (`author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module version info';
*/

module.exports = app => {
  const { STRING, BIGINT, TEXT, INTEGER, DATE } = app.Sequelize;

  const Model = app.model.define('ModuleVersion', {
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
    author: {
      type: STRING(100),
      allowNull: false,
      comment: 'first maintainer name',
    },
    name: {
      type: STRING(214),
      allowNull: false,
      comment: 'module name',
      charset: 'ascii',
      collate: 'ascii_general_ci',
    },
    version: {
      type: STRING(100),
      allowNull: false,
      comment: 'module version',
      charset: 'ascii',
      collate: 'ascii_general_ci',
    },
    description: {
      type: TEXT('long'),
    },
    package: {
      type: TEXT('long'),
      comment: 'package.json',
      get: utils.JSONGetter('package'),
      set: utils.JSONSetter('package'),
    },
    dist_shasum: {
      type: STRING(100),
      allowNull: true,
    },
    dist_tarball: {
      type: STRING(2048),
      allowNull: true,
    },
    dist_size: {
      type: INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'module',
    comment: 'module info',
    indexes: [
      {
        name: 'uk_name_version',
        unique: true,
        fields: [ 'name', 'version' ],
      },
      {
        name: 'idx_gmt_modified',
        fields: [ 'gmt_modified' ],
      },
      {
        name: 'idx_gmt_create',
        fields: [ 'gmt_create' ],
      },
      {
        name: 'idx_author',
        fields: [ 'author' ],
      },
    ],
  });

  Object.assign(Model.prototype, {
    async updatePackage(attrs) {
      const pkg = this.package;
      Object.assign(pkg, attrs);
      this.package = pkg;
      await this.save();
    },
  });

  return Model;
};
