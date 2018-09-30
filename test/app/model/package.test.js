'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/package.test.js', () => {
  describe('findByName()', () => {
    it('should init total table with one row', async () => {
      const ctx = app.mockContext();
      let row = await ctx.model.Package.findByName('foo');
      assert(!row);

      await ctx.model.Package.create({
        name: 'foo',
        author: 'fengmk2',
        license: 'MIT',
        description: 'description support emoji 😄 😈',
      });
      row = await ctx.model.Package.findByName('foo');
      assert(row);
      console.log(row.toJSON());
      assert(row.description === 'description support emoji 😄 😈');
      assert(row.license === 'MIT');
      assert(row.author === 'fengmk2');
    });
  });
});
