'use strict';

/*
CREATE TABLE IF NOT EXISTS `module_readme` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `version` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module version',
 `readme` longtext COMMENT 'the module version readme',
 `readme_filename` varchar(100) NOT NULL COMMENT 'readme filename',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name_version` (`name`, `version`),
 KEY `idx_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module version readme';
*/

module.exports = app => {
  const { BIGINT, STRING, TEXT, DATE } = app.Sequelize;

  const Model = app.model.define('ModuleVersionReadme', {
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
    readme: {
      type: TEXT('long'),
      comment: 'the module version readme',
    },
    readme_filename: {
      type: STRING(100),
      allowNull: false,
      comment: 'readme filename',
    },
  }, {
    tableName: 'module_readme',
    comment: 'the module version readme',
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
    ],
  });

  return Model;
};
