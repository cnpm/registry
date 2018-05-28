'use strict';

module.exports = app => {
  const { STRING, LONGTEXT } = app.Sequelize;

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
    classMethods: {
      async findByName(name) {
        return await this.find({
          where: { name },
        });
      },
    },
  };

  const Model = app.model.define('PackageReadme', {
    name: {
      type: STRING(100),
      allowNull: false,
      comment: 'module name',
    },
    version: {
      type: STRING(30),
      allowNull: false,
      comment: 'module latest version',
    },
    readme: {
      type: LONGTEXT,
      comment: 'latest version readme',
    },
  }, options);

  return Model;
};
