'use strict';

const moduleMaintainerClassMethods = require('../utils/module_maintainer_class_methods');

/*
CREATE TABLE IF NOT EXISTS `module_maintainer` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime NOT NULL COMMENT 'create time',
 `user` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'user name',
 `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'module name',
 PRIMARY KEY (`id`),
 UNIQUE KEY `module_maintainer_user_name` (`user`,`name`),
 KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='private module maintainers';
 */

module.exports = app => {
  const { STRING } = app.Sequelize;

  const options = {
    tableName: 'module_maintainer',
    comment: 'private module maintainers',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: [ 'user', 'name' ],
      },
      {
        fields: [ 'name' ],
      },
    ],
  };

  const Model = app.model.define('ModuleMaintainer', {
    user: {
      type: STRING(100),
      allowNull: false,
      comment: 'user name',
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
  }, options);

  Object.assign(Model, moduleMaintainerClassMethods);

  return Model;

};
