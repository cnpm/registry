'use strict';

/*
CREATE TABLE IF NOT EXISTS `module_deps` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `deps` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'which module depend on this module',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name_deps` (`name`,`deps`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module deps';
*/

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;

  const Model = app.model.define('ModuleDependency', {
    id: {
      type: BIGINT(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    gmt_create: {
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
    dependent: {
      field: 'deps',
      type: STRING(214),
      comment: '`name` is depended by `deps`. `deps` == depend => `name`',
      charset: 'ascii',
      collate: 'ascii_general_ci',
    },
  }, {
    tableName: 'module_deps',
    comment: 'module deps',
    // no need update timestamp
    updatedAt: false,
    indexes: [
      {
        name: 'uk_name_deps',
        unique: true,
        fields: [ 'name', 'deps' ],
      },
      {
        name: 'idx_name',
        fields: [ 'name' ],
      },
    ],
  });

  return Model;
};
