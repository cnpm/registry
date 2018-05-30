'use strict';

/*
CREATE TABLE IF NOT EXISTS `tag` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime NOT NULL COMMENT 'create time',
 `gmt_modified` datetime NOT NULL COMMENT 'modified time',
 `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'module name',
 `tag` varchar(30) NOT NULL COMMENT 'tag name',
 `version` varchar(50) NOT NULL COMMENT 'module version',
 `module_id` bigint(20) unsigned NOT NULL COMMENT 'module id',
 PRIMARY KEY (`id`),
 UNIQUE KEY `tag_name_tag` (`name`, `tag`),
 KEY `tag_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='module tag';
 */

module.exports = app => {
  const { STRING, BIGINT } = app.Sequelize;

  const options = {
    tableName: 'tag',
    comment: 'module tag',
    indexes: [
      {
        unique: true,
        fields: [ 'name', 'tag' ],
      },
      {
        fields: [ 'gmt_modified' ],
      },
    ],
  };

  const Model = app.model.define('Tag', {
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    tag: {
      type: STRING(30),
      allowNull: false,
      comment: 'tag name',
    },
    version: {
      type: STRING(50),
      allowNull: false,
      comment: 'module version',
    },
    module_id: {
      type: BIGINT(20),
      allowNull: false,
      comment: 'module id',
    },
  }, options);

  Model.findByNameAndTag = async (name, tag) => {
    return await this.find({ where: { name, tag } });
  };

  return Model;
};

