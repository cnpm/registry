'use strict';

const utils = require('../utils/');

/*
CREATE TABLE IF NOT EXISTS `module_unpublished` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime NOT NULL COMMENT 'create time',
 `gmt_modified` datetime NOT NULL COMMENT 'modified time',
 `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'module name',
 `package` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT 'base info: tags, time, maintainers, description, versions',
 PRIMARY KEY (`id`),
 UNIQUE KEY `module_unpublished_name` (`name`),
 KEY `module_unpublished_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='module unpublished info';
 */

module.exports = app => {
  const { STRING, TEXT } = app.Sequelize;

  const options = {
    tableName: 'module_unpublished',
    comment: 'module unpublished info',
    indexes: [
      {
        unique: true,
        fields: [ 'name' ],
      },
      {
        fields: [ 'gmt_modified' ],
      },
    ],
  };

  const Model = app.model.define('ModuleUnpublished', {
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    package: {
      type: TEXT('long'),
      comment: 'base info: tags, time, maintainers, description, versions',
      get: utils.JSONGetter('package'),
      set: utils.JSONSetter('package'),
    },
  }, options);

  Model.findByName = async name => {
    return await this.find({
      where: {
        name,
      },
    });
  };

  Model.save = async (name, pkg) => {
    let row = await this.find({
      where: {
        name,
      },
    });
    if (row) {
      row.package = pkg;
      if (row.changed()) {
        row = await row.save([ 'package' ]);
      }
      return row;
    }

    row = this.build({
      name,
      package: pkg,
    });
    return await row.save();
  };

  return Model;
};
