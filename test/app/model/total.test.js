'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/total.test.js', () => {
  it('should init total table with one row', async () => {
    const ctx = app.mockContext();
    const row = await ctx.model.Total.findOne({
      where: {
        name: 'total',
      },
    });
    assert(row);
    console.log(row.toJSON());
    assert(row.name === 'total');
    assert(row.gmt_modified);
    const gmt_modified = row.gmt_modified;

    // make sure gmt_modified auto update
    row.last_sync_module = 'foo';
    await row.save();

    const row2 = await ctx.model.Total.findOne({
      where: {
        name: 'total',
      },
    });
    assert(row2);
    console.log(row2.toJSON());
    assert(row2.name === row.name);
    assert(row2.gmt_modified.toJSON() !== gmt_modified.toJSON());
    assert(row2.gmt_modified.toJSON() > gmt_modified.toJSON());
  });
});
