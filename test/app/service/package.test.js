'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/package.test.js', () => {
  describe('get()', () => {
    it('should return null when package not exists', async () => {
      const ctx = app.mockContext();
      const pkg = await ctx.service.package.get('foo');
      assert(pkg === null);
    });

    it('should return exists package', async () => {
      const ctx = app.mockContext();
      await ctx.model.Package.create({
        name: 'foo',
        author: 'mockuser',
        description: 'test foo package',
        license: 'MIT',
      });
      const pkg = await ctx.service.package.get('foo');
      assert(pkg);
      assert(pkg.name === 'foo');
    });
  });

  describe('listAllTags()', () => {
    it('should return [] when not exists', async () => {
      const ctx = app.mockContext();
      const rows = await ctx.service.package.listAllTags('foo');
      assert(rows.length === 0);
    });

    it('should return [] when not exists', async () => {
      const ctx = app.mockContext();
      await ctx.model.Tag.create({
        name: 'foo',
        tag: 'latest',
        version: '1.0.0',
      });
      const rows = await ctx.service.package.listAllTags('foo');
      assert(rows.length === 1);
      assert(rows[0].tag === 'latest');
    });
  });

  describe('listAllVersions()', () => {
    it('should return [] when not exists', async () => {
      const ctx = app.mockContext();
      const rows = await ctx.service.package.listAllVersions('foo');
      assert(rows.length === 0);
    });

    it('should return exists rows', async () => {
      const ctx = app.mockContext();
      await ctx.model.ModuleVersion.create({
        author: 'fengmk2',
        name: 'pedding',
        version: '1.0.0',
        description: 'Just pedding for callback.😄🚀',
        package: {
          name: 'pedding',
          version: '1.0.0',
          description: 'Just pedding for callback.😄🚀',
          main: 'index.js',
          scripts: {
            test: 'make test-all',
          },
          repository: {
            type: 'git',
            url: 'git://github.com/fengmk2/pedding.git',
          },
          keywords: [
            'pedding',
            'callback',
          ],
          devDependencies: {
            contributors: '*',
            mocha: '*',
            'mocha-phantomjs': '*',
            component: '*',
            chai: '*',
          },
          author: {
            name: 'fengmk2',
            email: 'fengmk2@gmail.com',
          },
          license: 'MIT',
          contributors: [
            {
              name: 'fengmk2',
              email: 'fengmk2@gmail.com',
              url: 'https://github.com/fengmk2',
            },
            {
              name: 'dead-horse',
              email: 'dead_horse@qq.com',
              url: 'https://github.com/dead-horse',
            },
          ],
          gitHead: 'b42a708414a704336e9dee570a963e2dbe43e529',
          bugs: {
            url: 'https://github.com/fengmk2/pedding/issues',
          },
          homepage: 'https://github.com/fengmk2/pedding',
          _id: 'pedding@1.0.0',
          _shasum: '7f5098d60307b4ef7240c3d693cb20a9473c6074',
          _from: '.',
          _npmVersion: '1.4.13',
          _npmUser: {
            name: 'fengmk2',
            email: 'fengmk2@gmail.com',
          },
          maintainers: [
            {
              name: 'fengmk2',
              email: 'fengmk2@gmail.com',
            },
            {
              name: 'dead-horse',
              email: 'dead_horse@qq.com',
            },
          ],
          dist: {
            shasum: '7f5098d60307b4ef7240c3d693cb20a9473c6074',
            tarball: 'https://registry.npmjs.org/pedding/-/pedding-1.0.0.tgz',
          },
          directories: {},
        },
        dist_shasum: 'hex',
        dist_tarball: 'https://foo.com/foo.tgz',
        dist_size: 1024,
      });
      const rows = await ctx.service.package.listAllVersions('pedding');
      assert(rows.length === 1);
      assert(rows[0].name === 'pedding');
    });
  });

  describe('listAllAbbreviatedVersions()', () => {
    it('should return [] when not exists', async () => {
      const ctx = app.mockContext();
      const rows = await ctx.service.package.listAllAbbreviatedVersions('foo');
      assert(rows.length === 0);
    });

    it('should return exists rows', async () => {
      const ctx = app.mockContext();
      await ctx.model.ModuleAbbreviatedVersion.create({
        name: 'foo',
        version: '1.0.0',
        package: {
          name: 'foo',
          version: '1.0.0',
          _hasShrinkwrap: false,
          directories: {},
          dist: {
            shasum: '1bf102d5ae73afe2c553295e0fb02230216f65b2',
            tarball: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
          },
        },
      });
      const rows = await ctx.service.package.listAllAbbreviatedVersions('foo');
      assert(rows.length === 1);
      assert(rows[0].name === 'foo');
    });
  });

  describe('listAllMaintainers()', () => {
    it('should return [] when package not exists', async () => {
      const ctx = app.mockContext();
      const rows = await ctx.service.package.listAllMaintainers('foo');
      assert(rows.length === 0);
    });

    it('should return [] when user names all not exists', async () => {
      const ctx = app.mockContext();
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser1',
      });
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser2',
      });
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser3',
      });
      const rows = await ctx.service.package.listAllMaintainers('foo');
      assert(rows.length === 0);
    });

    it('should return all when user names all exists', async () => {
      const ctx = app.mockContext();
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser1',
      });
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser3',
      });
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser2',
      });
      await ctx.service.user.create('mockuser1', 'mockuser1@mock.com', 'hello123');
      await ctx.service.user.create('mockuser3', 'mockuser3@mock.com', 'hello123');
      await ctx.service.user.create('mockuser2', 'mockuser2@mock.com', 'hello123');
      const rows = await ctx.service.package.listAllMaintainers('foo');
      assert(rows.length === 3);
      assert.deepEqual(rows.map(item => ({ name: item.name, email: item.email })), [
        { name: 'mockuser1', email: 'mockuser1@mock.com' },
        { name: 'mockuser3', email: 'mockuser3@mock.com' },
        { name: 'mockuser2', email: 'mockuser2@mock.com' },
      ]);
    });

    it('should return only exists users', async () => {
      const ctx = app.mockContext();
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser1',
      });
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser3',
      });
      await ctx.model.PrivatePackageMaintainer.create({
        name: 'foo',
        user: 'mockuser2',
      });
      await ctx.service.user.create('mockuser1', 'mockuser1@mock.com', 'hello123');
      await ctx.service.user.create('mockuser2', 'mockuser2@mock.com', 'hello123');
      const rows = await ctx.service.package.listAllMaintainers('foo');
      assert(rows.length === 2);
      assert.deepEqual(rows.map(item => ({ name: item.name, email: item.email })), [
        { name: 'mockuser1', email: 'mockuser1@mock.com' },
        { name: 'mockuser2', email: 'mockuser2@mock.com' },
      ]);
    });
  });

  describe('getVersionReadme()', () => {
    it('should return null when not exists', async () => {
      const ctx = app.mockContext();
      const row = await ctx.service.package.getVersionReadme('foo', '1.0.0');
      assert(row === null);
    });

    it('should return exists readme', async () => {
      const ctx = app.mockContext();
      await ctx.model.ModuleVersionReadme.create({
        name: 'foo',
        version: '1.0.0',
        readme: '# Hello \n foo bar',
        readme_filename: 'README.md',
      });
      const row = await ctx.service.package.getVersionReadme('foo', '1.0.0');
      assert(row);
      assert(row.readme === '# Hello \n foo bar');
    });
  });

  describe('getVersion()', () => {
    it('should return null when not exists', async () => {
      const ctx = app.mockContext();
      const row = await ctx.service.package.getVersion('foo', '1.0.0');
      assert(row === null);
    });

    it('should return exists version', async () => {
      const ctx = app.mockContext();
      await ctx.model.ModuleVersion.create({
        author: 'fengmk2',
        name: 'pedding',
        version: '1.0.0',
        description: 'Just pedding for callback.😄🚀',
        package: {
          name: 'pedding',
          version: '1.0.0',
          description: 'Just pedding for callback.😄🚀',
          main: 'index.js',
          scripts: {
            test: 'make test-all',
          },
          repository: {
            type: 'git',
            url: 'git://github.com/fengmk2/pedding.git',
          },
          keywords: [
            'pedding',
            'callback',
          ],
          devDependencies: {
            contributors: '*',
            mocha: '*',
            'mocha-phantomjs': '*',
            component: '*',
            chai: '*',
          },
          author: {
            name: 'fengmk2',
            email: 'fengmk2@gmail.com',
          },
          license: 'MIT',
          contributors: [
            {
              name: 'fengmk2',
              email: 'fengmk2@gmail.com',
              url: 'https://github.com/fengmk2',
            },
            {
              name: 'dead-horse',
              email: 'dead_horse@qq.com',
              url: 'https://github.com/dead-horse',
            },
          ],
          gitHead: 'b42a708414a704336e9dee570a963e2dbe43e529',
          bugs: {
            url: 'https://github.com/fengmk2/pedding/issues',
          },
          homepage: 'https://github.com/fengmk2/pedding',
          _id: 'pedding@1.0.0',
          _shasum: '7f5098d60307b4ef7240c3d693cb20a9473c6074',
          _from: '.',
          _npmVersion: '1.4.13',
          _npmUser: {
            name: 'fengmk2',
            email: 'fengmk2@gmail.com',
          },
          maintainers: [
            {
              name: 'fengmk2',
              email: 'fengmk2@gmail.com',
            },
            {
              name: 'dead-horse',
              email: 'dead_horse@qq.com',
            },
          ],
          dist: {
            shasum: '7f5098d60307b4ef7240c3d693cb20a9473c6074',
            tarball: 'https://registry.npmjs.org/pedding/-/pedding-1.0.0.tgz',
          },
          directories: {},
        },
        dist_shasum: 'hex',
        dist_tarball: 'https://foo.com/foo.tgz',
        dist_size: 1024,
      });
      const row = await ctx.service.package.getVersion('pedding', '1.0.0');
      assert(row);
      assert(row.name === 'pedding');
      assert(row.version === '1.0.0');
      assert(row.package.name === 'pedding');
      assert(row.package.author);
      assert(row.package.dist);
      assert(row.package.description === 'Just pedding for callback.😄🚀');
      assert(row.description === 'Just pedding for callback.😄🚀');
    });
  });

  describe('getTag()', () => {
    it('should return null when tag not exists', async () => {
      const ctx = app.mockContext();
      const tag = await ctx.service.package.getTag('foo', 'latest');
      assert(tag === null);
    });

    it('should return exists tag', async () => {
      const ctx = app.mockContext();
      await ctx.model.Tag.create({
        name: 'foo',
        tag: 'latest',
        version: '1.0.0',
      });
      const tag = await ctx.service.package.getTag('foo', 'latest');
      assert(tag);
      assert(tag.name === 'foo');
      assert(tag.tag === 'latest');
      assert(tag.version === '1.0.0');
    });
  });
});
