'use strict';

/*
CREATE TABLE IF NOT EXISTS `package` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'package name',
 `author` varchar(100) NOT NULL COMMENT 'first publish author name',
 `description` longtext COMMENT 'module description',
 `license` varchar(100) NOT NULL COMMENT 'license of the package',
 `private` tinyint(1) DEFAULT '0' COMMENT 'private package or not, 1: true, other: false',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name` (`name`),
 KEY `idx_gmt_modified` (`gmt_modified`),
 KEY `idx_author` (`author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='package info';
*/

// https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
module.exports = app => {
  const { STRING, BIGINT, TEXT, DATE, BOOLEAN } = app.Sequelize;

  const Model = app.model.define('Package', {
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
      type: STRING(214),
      allowNull: false,
      comment: 'package name',
      charset: 'ascii',
      collate: 'ascii_general_ci',
    },
    author: {
      type: STRING(100),
      allowNull: false,
      comment: 'first publish author name',
    },
    description: {
      type: TEXT('long'),
    },
    license: {
      type: STRING(100),
      allowNull: true,
      comment: 'license of the package',
    },
    isPrivate: {
      field: 'private',
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'private package or not, 1: true, other: false',
    },
  }, {
    tableName: 'package',
    comment: 'package info',
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
      {
        name: 'idx_author',
        fields: [ 'author' ],
      },
    ],
  });

  Object.assign(Model, {
    async findByName(name) {
      return await this.findOne({
        where: { name },
      });
    },
  });

  return Model;
};
