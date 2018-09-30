'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/module_version.test.js', () => {
  it('should name can store npm validate package name', async () => {
    const ctx = app.mockContext();
    // all names come from https://github.com/npm/validate-npm-package-name/blob/master/test/index.js#L6
    const names = [
      'some-package',
      'example.com',
      'under_score',
      'period.js',
      '123numeric',
      '@npm/thingy',
      '@npm-zors/moneytime.js',
      'favicon.ico',
      'http',
      // 214 chars
      'ifyouwanttogetthesumoftwonumberswherethosetwonumbersarechosenbyfindingthelargestoftwooutofthreenumbersandsquaringthemwhichismultiplyingthembyitselfthenyoushouldinputthreenumbersintothisfunctionanditwilldothatforyou',
      'CAPITAL-LETTERS', // same to lowercase
    ];
    for (const name of names) {
      const version = '1.0.0';
      const row = await ctx.model.ModuleVersion.create({
        name,
        version,
        author: 'foo',
      });
      assert(row);
      // console.log(row.toJSON());
      assert(row.name === name);
      assert(row.version === version);
      assert(row.gmt_create);
      assert(row.gmt_modified);
      // select to lower case
      const row2 = await ctx.model.ModuleVersion.findOne({
        where: {
          name: name.toLowerCase(),
          version,
        },
      });
      assert(row2);
      assert(row2.name === row.name);
      assert(row2.version === row.version);
      assert(row2.gmt_create.toJSON() === row.gmt_create.toJSON());
      assert(row2.gmt_modified.toJSON() === row.gmt_modified.toJSON());
    }
  });
});
