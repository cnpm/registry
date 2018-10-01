'use strict';

/*
CREATE TABLE IF NOT EXISTS `module_maintainer` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `user` varchar(100) NOT NULL COMMENT 'user name',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_user_module_name` (`user`,`name`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='private module maintainers';
*/

module.exports = app => {
  const { BIGINT, STRING, DATE } = app.Sequelize;

  const Model = app.model.define('ModuleMaintainer', {
    id: {
      type: BIGINT(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    gmt_create: {
      type: DATE(6),
      allowNull: false,
    },
    user: {
      type: STRING(100),
      allowNull: false,
      comment: 'user name',
    },
    name: {
      type: STRING(214),
      allowNull: false,
      comment: 'module name',
      charset: 'ascii',
      collate: 'ascii_general_ci',
    },
  }, {
    tableName: 'module_maintainer',
    comment: 'private module maintainers',
    updatedAt: false,
    indexes: [
      {
        name: 'uk_user_module_name',
        unique: true,
        fields: [ 'user', 'name' ],
      },
      {
        name: 'idx_name',
        fields: [ 'name' ],
      },
    ],
  });

  return Model;

};
