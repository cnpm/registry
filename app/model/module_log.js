'use strict';

/*
CREATE TABLE IF NOT EXISTS `module_log` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `username` varchar(100) NOT NULL COMMENT 'which username',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `log` longtext COMMENT 'the raw log',
 PRIMARY KEY (`id`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module sync log';
*/

module.exports = app => {
  const { BIGINT, STRING, TEXT, DATE } = app.Sequelize;

  return app.model.define('ModuleLog', {
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
    username: {
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
    log: {
      type: TEXT('long'),
    },
  }, {
    tableName: 'module_log',
    comment: 'module sync log',
    indexes: [
      {
        name: 'idx_name',
        fields: [ 'name' ],
      },
    ],
  });
};
