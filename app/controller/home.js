'use strict';

const Controller = require('egg').Controller;

module.exports = class extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      db_name: 'registry',
      doc_count: 1013143,
      doc_del_count: 342,
      update_seq: 13567690,
      purge_seq: 0,
      compact_running: false,
      disk_size: 9901686919,
      data_size: 8563938702,
      index_size: 0,
      instance_start_time: '1534335165238222',
      disk_format_version: 6,
      committed_update_seq: 13567690,

      // registry.cnpmjs.org custom fields
      doc_version_count: 7049219,
      user_count: 283713,
      sync_status: 1,
      need_sync_num: 100,
      success_sync_num: 4,
      fail_sync_num: 0,
      left_sync_num: 96,
      last_sync_time: 1528458234827,
      last_exist_sync_time: 1402316573365,
      last_sync_module: 'the-components',
      download: {
        today: 18725,
        thisweek: 18725,
        thismonth: 18725,
        lastday: 4972040,
        lastweek: 41577511,
        lastmonth: 138127618,
      },
      node_version: 'v10.9.0',
      app_version: '3.0.0-rc.5',
      sync_model: 'all',
      cache_time: 1538324477089,
    };
  }
};
