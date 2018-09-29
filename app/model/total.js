'use strict';

/*
CREATE TABLE IF NOT EXISTS `total` (
 `name` varchar(100) NOT NULL COMMENT 'total name',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `module_delete` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT 'module delete count',
 `last_sync_time` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT 'last timestamp sync from official registry',
 `last_exist_sync_time` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT 'last timestamp sync exist packages from official registry',
 `sync_status` int unsigned NOT NULL DEFAULT '0' COMMENT 'system sync from official registry status',
 `need_sync_num` int unsigned NOT NULL DEFAULT '0' COMMENT 'how many packages need to be sync',
 `success_sync_num` int unsigned NOT NULL DEFAULT '0' COMMENT 'how many packages sync success at this time',
 `fail_sync_num` int unsigned NOT NULL DEFAULT '0' COMMENT 'how many packages sync fail at this time',
 `left_sync_num` int unsigned NOT NULL DEFAULT '0' COMMENT 'how many packages left to be sync',
 `last_sync_module` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci COMMENT 'last sync success module name',
 PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='total info';
-- init `total` count
INSERT INTO total(name, gmt_modified) VALUES('total', now())
  ON DUPLICATE KEY UPDATE gmt_modified=now();
*/

module.exports = app => {
  const { STRING, BIGINT, INTEGER, DATE } = app.Sequelize;

  const Model = app.model.define('Total', {
    name: {
      type: STRING(100),
      primaryKey: true,
      comment: 'total name',
    },
    gmt_modified: {
      type: DATE(6),
      allowNull: false,
    },
    module_delete: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'module delete count',
    },
    last_sync_time: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'last timestamp sync from official registry',
    },
    last_exist_sync_time: {
      type: BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'last timestamp sync exist packages from official registry',
    },
    sync_status: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'system sync from official registry status',
    },
    need_sync_num: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'how many packages need to be sync',
    },
    success_sync_num: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'how many packages sync success at this time',
    },
    fail_sync_num: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'how many packages sync fail at this time',
    },
    left_sync_num: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'how many packages left to be sync',
    },
    last_sync_module: {
      type: STRING(214),
      allowNull: true,
      comment: 'last sync success module name',
      charset: 'ascii',
      collate: 'ascii_general_ci',
    },
  }, {
    tableName: 'total',
    comment: 'total info',
    createdAt: false,
  });

  Object.assign(Model, {
    async getTotal() {
      return await this.findOne({
        where: { name: 'total' },
      });
    },

    async init() {
      const row = await this.getTotal();
      if (!row) {
        await this.create({ name: 'total' });
      }
    },
  });

  return Model;
};
