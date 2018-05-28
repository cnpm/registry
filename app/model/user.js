'use strict';

/*
CREATE TABLE IF NOT EXISTS `user` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime NOT NULL COMMENT 'create time',
 `gmt_modified` datetime NOT NULL COMMENT 'modified time',
 `name` varchar(100) NOT NULL COMMENT 'user name',
 `salt` varchar(100) NOT NULL,
 `password_sha` varchar(100) NOT NULL COMMENT 'user password hash',
 `ip` varchar(64) NOT NULL COMMENT 'user last request ip',
 `roles` varchar(200) NOT NULL DEFAULT '[]',
 `rev` varchar(40) NOT NULL,
 `email` varchar(400) NOT NULL,
 `json` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT 'json details',
 `npm_user` tinyint(1) DEFAULT '0' COMMENT 'user sync from npm or not, 1: true, other: false',
 PRIMARY KEY (`id`),
 UNIQUE KEY `user_name` (`name`),
 KEY `user_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='user base info';
*/

module.exports = app => {
  const { STRING, INTEGER, DATE, LONGTEXT } = app.Sequelize;

  const Model = app.model.define('user', {
    id: INTEGER(20),
    gmt_create: DATE,
    gmt_modified: DATE,
    name: STRING(100),
    salt: STRING(100),
    password_sha: STRING(100),
    ip: STRING(64),
    roles: STRING(200),
    rev: STRING(40),
    email: STRING(400),
    json: LONGTEXT,
    npm_user: INTEGER(1),

  });

  return Model;
};
