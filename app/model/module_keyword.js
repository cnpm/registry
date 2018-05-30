'use strict';

/*
CREATE TABLE IF NOT EXISTS `module_keyword` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime NOT NULL COMMENT 'create time',
 `keyword` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'keyword',
 `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'module name',
 `description` TEXT,
 PRIMARY KEY (`id`),
 UNIQUE KEY `keyword_module_name` (`keyword`,`name`),
 KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='module keyword';
 */

module.exports = app => {
  const { STRING, TEXT } = app.Sequelize;

  const options = {
    tableName: 'module_keyword',
    comment: 'module keyword',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: [ 'keyword', 'name' ],
      },
      {
        fields: [ 'name' ],
      },
    ],
  };

  const Model = app.model.define('ModuleKeyword', {
    keyword: {
      type: STRING(100),
      allowNull: false,
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    description: {
      type: TEXT('long'),
      allowNull: true,
    },
  }, options);

  Model.findByKeywordAndName = async (keyword, name) => {
    return await this.find({
      where: {
        keyword,
        name,
      },
    });
  };

  return Model;
};
