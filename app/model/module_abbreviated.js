'use strict';

module.exports = app => {
  const { STRING, BIGINT, TEXT } = app.Sequelize;

  const options = {
    tableName: 'module_abbreviated',
    comment: 'module abbreviated info',
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
    ],
  };

  const Model = app.model.define('ModuleAbbreviated', {
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    version: {
      type: STRING(50),
      allowNull: false,
      comment: 'module version',
    },
    package: {
      type: TEXT('long'),
      comment: 'package.json',
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
