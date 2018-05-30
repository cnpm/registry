'use strict';

module.exports = app => {
  const { STRING, TEXT } = app.Sequelize;

  const options = {
    tableName: 'package_readme',
    comment: 'package latest readme',
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

  const Model = app.model.define('PackageReadme', {
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    version: {
      type: STRING(50),
      allowNull: false,
      comment: 'module latest version',
    },
    readme: {
      type: TEXT('long'),
      comment: 'latest version readme',
    },
  }, options);

  Model.findByName = async name => {
    return await this.find({
      where: { name },
    });
  };

  return Model;
};
