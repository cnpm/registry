'use strict';

const utils = require('../utils/model_utils');

/*
CREATE TABLE IF NOT EXISTS `module_unpublished` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'package name',
 `package` longtext COMMENT 'base info: tags, time, maintainers, description, versions',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name` (`name`),
 KEY `idx_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='package unpublished info';
*/

module.exports = app => {
  const { BIGINT, STRING, TEXT, DATE } = app.Sequelize;

  const Model = app.model.define('PackageUnpublished', {
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
    package: {
      type: TEXT('long'),
      comment: 'base info: tags, time, maintainers, description, versions',
      get: utils.JSONGetter('package'),
      set: utils.JSONSetter('package'),
    },
  }, {
    tableName: 'module_unpublished',
    comment: 'package unpublished info',
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
