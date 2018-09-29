'use strict';

/*
CREATE TABLE IF NOT EXISTS `module_keyword` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `keyword` varchar(100) NOT NULL COMMENT 'keyword',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `description` longtext COMMENT 'module description',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_keyword_module_name` (`keyword`,`name`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module keyword';
*/

module.exports = app => {
  const { BIGINT, STRING, TEXT, DATE } = app.Sequelize;

  const Model = app.model.define('ModuleKeyword', {
    id: {
      type: BIGINT(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    gmt_create: {
      type: DATE(6),
      allowNull: false,
    },
    keyword: {
      type: STRING(100),
      allowNull: false,
      comment: 'keyword',
    },
    name: {
      type: STRING(214),
      allowNull: false,
      comment: 'module name',
      charset: 'ascii',
      collate: 'ascii_general_ci',
    },
    description: {
      type: TEXT('long'),
      allowNull: true,
      comment: 'module description',
    },
  }, {
    tableName: 'module_keyword',
    comment: 'module keyword',
    updatedAt: false,
    indexes: [
      {
        name: 'uk_keyword_module_name',
        unique: true,
        fields: [ 'keyword', 'name' ],
      },
      {
        name: 'idx_name',
        fields: [ 'name' ],
      },
    ],
  });

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
