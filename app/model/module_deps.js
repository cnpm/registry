'use strict';

/*
CREATE TABLE IF NOT EXISTS `module_deps` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime NOT NULL COMMENT 'create time',
 `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'module name',
 `deps` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '`name` is deped by `deps`',
 PRIMARY KEY (`id`),
 UNIQUE KEY `module_deps_name_deps` (`name`,`deps`),
 KEY `deps` (`module_deps_deps`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='module deps';
 */

module.exports = app => {
  const { STRING } = app.Sequelize;

  const options = {
    tableName: 'module_deps',
    comment: 'module deps',
    // no need update timestamp
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: [ 'name', 'deps' ],
      },
      {
        fields: [ 'deps' ],
      },
    ],
  };

  const Model = app.model.define('ModuleDependency', {
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    dependent: {
      field: 'deps',
      type: STRING(100),
      comment: '`name` is depended by `deps`. `deps` == depend => `name`',
    },
  }, options);

  return Model;
};
