'use strict';

/*
CREATE TABLE IF NOT EXISTS `module` (
  `id` INTEGER NOT NULL auto_increment ,
  `author` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `version` VARCHAR(30) NOT NULL,
  `description` TEXT,
  `package` TEXT,
  `dist_shasum` VARCHAR(100),
  `dist_tarball` VARCHAR(2048),
  `dist_size` INTEGER UNSIGNED NOT NULL DEFAULT 0,
  `publish_time` BIGINT(20) UNSIGNED,
  `gmt_create` DATETIME NOT NULL,
  `gmt_modified` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
)
COMMENT 'module info' ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;

CREATE UNIQUE INDEX `module_name_version` ON `module` (`name`, `version`);
CREATE INDEX `module_gmt_modified` ON `module` (`gmt_modified`);
CREATE INDEX `module_publish_time` ON `module` (`publish_time`);
CREATE INDEX `module_author` ON `module` (`author`);
*/

module.exports = app => {
  const { STRING, BIGINT, TEXT, INTEGER } = app.Sequelize;

  const options = {
    tableName: 'module',
    comment: 'module info',
    indexes: [
      {
        unique: true,
        fields: [ 'name', 'version' ],
      },
      {
        fields: [ 'gmt_modified' ],
      },
      {
        fields: [ 'publish_time' ],
      },
      {
        fields: [ 'author' ],
      },
    ],
  };

  const Model = app.model.define('Module', {
    author: {
      type: STRING(100),
      allowNull: false,
      comment: 'first maintainer name',
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    version: {
      type: STRING(30),
      allowNull: false,
      comment: 'module version',
    },
    description: {
      type: TEXT('long'),
    },
    package: {
      type: TEXT('long'),
      comment: 'package.json',
    },
    dist_shasum: {
      type: STRING(100),
      allowNull: true,
    },
    dist_tarball: {
      type: STRING(2048),
      allowNull: true,
    },
    dist_size: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    publish_time: {
      type: BIGINT(20),
      allowNull: true,
    },
  }, options);

  Model.findByNameAndVersion = async (name, version) => {
    return await this.find({
      where: { name, version },
    });
  };

  return Model;
};
