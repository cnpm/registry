'use strict';

/*
CREATE TABLE IF NOT EXISTS `downloads` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
  `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
  `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
  `date` int unsigned NOT NULL COMMENT 'YYYYMM format',
  `d01` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '01 download count',
  `d02` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '02 download count',
  `d03` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '03 download count',
  `d04` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '04 download count',
  `d05` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '05 download count',
  `d06` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '06 download count',
  `d07` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '07 download count',
  `d08` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '08 download count',
  `d09` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '09 download count',
  `d10` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '10 download count',
  `d11` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '11 download count',
  `d12` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '12 download count',
  `d13` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '13 download count',
  `d14` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '14 download count',
  `d15` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '15 download count',
  `d16` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '16 download count',
  `d17` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '17 download count',
  `d18` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '18 download count',
  `d19` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '19 download count',
  `d20` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '20 download count',
  `d21` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '21 download count',
  `d22` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '22 download count',
  `d23` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '23 download count',
  `d24` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '24 download count',
  `d25` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '25 download count',
  `d26` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '26 download count',
  `d27` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '27 download count',
  `d28` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '28 download count',
  `d29` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '29 download count',
  `d30` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '30 download count',
  `d31` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '31 download count',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name_date` (`name`, `date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module download total info';
*/

module.exports = app => {
  const { STRING, BIGINT, INTEGER, DATE } = app.Sequelize;

  const Model = app.model.define('DownloadTotal', {
    id: {
      type: BIGINT(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    gmt_create: {
      type: DATE(6),
      allowNull: false,
    },
    gmt_modified: {
      type: DATE(6),
      allowNull: false,
    },
    name: {
      type: STRING(214),
      allowNull: false,
      comment: 'module name',
      charset: 'ascii',
      collate: 'ascii_general_ci',
    },
    date: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'YYYYMM format',
    },
    d01: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '01 download count',
    },
    d02: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '02 download count',
    },
    d03: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '03 download count',
    },
    d04: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '04 download count',
    },
    d05: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '05 download count',
    },
    d06: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '06 download count',
    },
    d07: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '07 download count',
    },
    d08: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '08 download count',
    },
    d09: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '09 download count',
    },
    d10: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '10 download count',
    },
    d11: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '11 download count',
    },
    d12: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '12 download count',
    },
    d13: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '13 download count',
    },
    d14: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '14 download count',
    },
    d15: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '15 download count',
    },
    d16: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '16 download count',
    },
    d17: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '17 download count',
    },
    d18: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '18 download count',
    },
    d19: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '19 download count',
    },
    d20: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '20 download count',
    },
    d21: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '21 download count',
    },
    d22: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '22 download count',
    },
    d23: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '23 download count',
    },
    d24: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '24 download count',
    },
    d25: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '25 download count',
    },
    d26: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '26 download count',
    },
    d27: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '27 download count',
    },
    d28: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '28 download count',
    },
    d29: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '29 download count',
    },
    d30: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '30 download count',
    },
    d31: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '31 download count',
    },
  }, {
    tableName: 'downloads',
    comment: 'module download total info',
    indexes: [
      {
        name: 'uk_name_date',
        unique: true,
        fields: [ 'name', 'date' ],
      },
      {
        name: 'idx_date',
        fields: [ 'date' ],
      },
    ],
  });

  return Model;
};
