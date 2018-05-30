'use strict';

/*
CREATE TABLE IF NOT EXISTS `module_log` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime NOT NULL COMMENT 'create time',
 `gmt_modified` datetime NOT NULL COMMENT 'modified time',
 `username` varchar(100) NOT NULL,
 `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'module name',
 `log` TEXT,
 PRIMARY KEY (`id`),
 KEY `module_log_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='module sync log';
 */

module.exports = app => {
  const { STRING, TEXT } = app.Sequelize;

  const options = {
    tableName: 'module_log',
    comment: 'module sync log',
    indexes: [
      {
        fields: [ 'name' ],
      },
    ],
  };

  return app.model.define('ModuleLog', {
    username: {
      type: STRING(100),
      allowNull: false,
      comment: 'user name',
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    log: {
      type: TEXT('long'),
    },
  }, options);

};
