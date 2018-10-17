'use strict';

const testUtils = require('../../utils');
const { app, assert, mock } = require('egg-mock/bootstrap');

describe('test/app/controller/package.test.js', () => {
  describe('PUT /{package}', () => {
    it('should 422 publish a public non-scoped package', async () => {
      app.mockUser({ name: 'mockuser1' });
      const pkg = testUtils.getPackage();
      const res = await app.httpRequest()
        .put(`/${pkg.name}`)
        .send(pkg);
      assert(res.status === 422);
      assert.deepEqual(res.body, {
        error: 'name: name must start with private scopes',
      });
    });

    it('should 422 publish a public scoped package', async () => {
      app.mockUser({ name: 'mockuser1' });
      const pkg = testUtils.getPackage('@foo/bar');
      const res = await app.httpRequest()
        .put(`/${pkg.name}`)
        .send(pkg);
      assert(res.status === 422);
      assert.deepEqual(res.body, {
        error: 'name: name must start with private scopes',
      });
    });

    it('should 401 when on anonymous user', async () => {
      const pkg = testUtils.getPackage('@cnpm/bar');
      const res = await app.httpRequest()
        .put(`/${pkg.name}`)
        .send(pkg);
      assert(res.status === 401);
      assert.deepEqual(res.body, {
        error: 'Unauthorized',
      });
    });

    it('should 401 when normal user publish on enablePrivate = true', async () => {
      app.mockUser({ name: 'mockuser1' });
      mock(app.config, 'enablePrivate', true);
      const pkg = testUtils.getPackage('@cnpm/bar');
      const res = await app.httpRequest()
        .put(`/${pkg.name}`)
        .send(pkg);
      assert(res.status === 401);
      assert.deepEqual(res.body, {
        error: 'required admin user',
      });
    });

    it('should 403 when user is not maintainer on exists package', async () => {
      mockPackage('@cnpm/bar');
      app.mockUser({ name: 'mockuser1' });
      const pkg = testUtils.getPackage('@cnpm/bar');
      const res = await app.httpRequest()
        .put(`/${pkg.name}`)
        .send(pkg);
      assert(res.status === 403);
      assert.deepEqual(res.body, {
        error: 'Access denied',
      });
    });

    it('should 201 on public a new package', async () => {
      app.mockUser({ name: 'mockuser1' });
      const pkg = testUtils.getPackage('@cnpm/bar', '1.0.0', 'mockuser1');
      let res = await app.httpRequest()
        .put(`/${pkg.name}`)
        .send(pkg);
      assert(res.status === 201);
      assert.deepEqual(res.body, {
        ok: true,
        rev: '1',
      });

      res = await app.httpRequest()
        .get('/@cnpm/bar');
      assert(res.status === 200);
      assert(res.headers['content-type'] === 'application/json; charset=utf-8');
      assert(res.body.versions['1.0.0']);
    });
  });

  describe('GET /{package}', () => {
    it('should 422 when package name invalid', async () => {
      let res = await app.httpRequest()
        .get('/.foo');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with a period',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('    ')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: required',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('  \t\t\n\n\r\r  ')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: required',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('  \t\t\n\n\r\ra.\t.a.  ')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('?foo')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can\'t start with a question mark',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('&foo')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get('/!foo');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can\'t start with an exclamation point',
      });

      res = await app.httpRequest()
        .get('/|foo');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get('/@foo/~bar');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can no longer contain special characters ("~\'!()*")',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/_bar')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with an underscore',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo')}/.bar`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with a period',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/')}?bar`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/')}@bar`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/@${encodeURIComponent('foo/,bar')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/.bar/1.0.0')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });

      res = await app.httpRequest()
        .get(`/@${encodeURIComponent('foo/.bar/1.0.0')}`);
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name can only contain URL-friendly characters',
      });
    });

    it('should 404 when package not exists', async () => {
      let res = await app.httpRequest()
        .get('/foo');
      assert(res.status === 404);

      res = await app.httpRequest()
        .get('/@foo/bar');
      assert(res.status === 404);
    });

    it('should return full format of normal package', async () => {
      mockPackage('tiny-tarball', [
        {
          name: 'mockuser',
          email: 'mockuser@cnpmjs.org',
        },
      ]);
      const res = await app.httpRequest()
        .get('/tiny-tarball');
      assert(res.status === 200);
      assert(res.headers['content-type'] === 'application/json; charset=utf-8');
      assert.deepEqual(res.body, {
        _id: 'tiny-tarball',
        _rev: '1',
        name: 'tiny-tarball',
        description: 'tiny tarball used for health checks',
        'dist-tags': {
          latest: '1.0.0',
        },
        versions: {
          '1.0.0': {
            name: 'tiny-tarball',
            version: '1.0.0',
            description: 'tiny tarball used for health checks',
            main: 'index.js',
            scripts: {
              test: 'echo "Error: no test specified" && exit 1',
            },
            author: {
              name: 'Ben Coe',
              email: 'ben@npmjs.com',
            },
            license: 'ISC',
            _id: 'tiny-tarball@1.0.0',
            _shasum: 'bbf102d5ae73afe2c553295e0fb02230216f65b1',
            _from: '.',
            _npmVersion: '2.7.0',
            _nodeVersion: '1.5.0',
            _npmUser: {
              name: 'bcoe',
              email: 'bencoe@gmail.com',
            },
            maintainers: [
              {
                name: 'bcoe',
                email: 'bencoe@gmail.com',
              },
            ],
            dist: {
              shasum: 'bbf102d5ae73afe2c553295e0fb02230216f65b1',
              tarball: 'https://registry.npmjs.org/tiny-tarball/-/tiny-tarball-1.0.0.tgz',
            },
            directories: {},
          },
        },
        readme: "# TinyTarball\n\ntiny-tarball used for health checks\n\n**don't unpublish me!**\n",
        maintainers: [
          {
            name: 'mockuser',
            email: 'mockuser@cnpmjs.org',
          },
        ],
        time: {
          modified: '2015-05-16T22:27:54.741Z',
          created: '2015-03-24T00:12:24.039Z',
          '1.0.0': '2015-03-24T00:12:24.039Z',
        },
        author: {
          name: 'Ben Coe',
          email: 'ben@npmjs.com',
        },
        license: 'ISC',
        readmeFilename: 'README.md',
        _attachments: {},
      });
    });

    it('should return full format of scoped package', async () => {
      mockScopedPackage('@mock/tiny-tarball', [
        {
          name: 'mockuser',
          email: 'mockuser@cnpmjs.org',
        },
      ]);
      const res = await app.httpRequest()
        .get('/@mock/tiny-tarball');
      assert(res.status === 200);
      assert(res.headers['content-type'] === 'application/json; charset=utf-8');
      assert.deepEqual(res.body.time, {
        created: '2017-09-30T19:49:26.640Z',
        modified: '2018-08-11T12:49:35.683Z',
        '2.2.1': '2017-09-30T19:49:26.640Z',
        '2.2.2': '2018-07-11T12:49:35.683Z',
      });
    });

    it('should return abbreviated format on normal package', async () => {
      mockPackage('tiny-tarball');
      const res = await app.httpRequest()
        .get('/tiny-tarball')
        .set('accept', 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*');
      assert(res.status === 200);
      assert(res.headers['content-type'] === 'application/vnd.npm.install-v1+json; charset=utf-8');
      assert.deepEqual(res.body, {
        versions: {
          '1.0.0': {
            name: 'tiny-tarball',
            version: '1.0.0',
            _hasShrinkwrap: false,
            directories: {},
            dist: {
              shasum: 'bbf102d5ae73afe2c553295e0fb02230216f65b1',
              tarball: 'https://registry.npmjs.org/tiny-tarball/-/tiny-tarball-1.0.0.tgz',
            },
          },
        },
        name: 'tiny-tarball',
        'dist-tags': {
          latest: '1.0.0',
        },
        modified: '2015-05-16T22:27:54.741Z',
      });
    });

    it('should return abbreviated format on scoped package', async () => {
      mockScopedPackage('@mock/tiny-tarball');
      const res = await app.httpRequest()
        .get('/@mock/tiny-tarball')
        .set('accept', 'application/vnd.npm.install-v1+json');
      assert(res.status === 200);
      assert(res.headers['content-type'] === 'application/vnd.npm.install-v1+json; charset=utf-8');
      const keys = Object.keys(res.body).sort();
      assert.deepEqual(keys, [ 'dist-tags', 'modified', 'name', 'versions' ]);
      assert(res.body.versions['2.2.2']);
      assert(Object.keys(res.body.versions).length === 2);
      assert(res.body.name === '@mock/tiny-tarball');
      assert(res.body.modified === '2018-08-08T05:43:58.107Z');
    });

    it('should 200 on normal package', async () => {
      mockPackage('bar');
      let res = await app.httpRequest()
        .get('/bar');
      assert(res.status === 200);

      mockPackage('-bar');
      res = await app.httpRequest()
        .get('/-bar');
      assert(res.status === 200);
    });

    it('should 200 on scoped package', async () => {
      mockScopedPackage('@foo/bar');
      let res = await app.httpRequest()
        .get('/@foo/bar');
      assert(res.status === 200);

      mockScopedPackage('@foo/-bar');
      res = await app.httpRequest()
        .get('/@foo/-bar');
      assert(res.status === 200);

      mockScopedPackage('@foo/bar2');
      res = await app.httpRequest()
        .get('/@foo/bar2/');
      assert(res.status === 200);

      mockScopedPackage('@foo/bar3');
      res = await app.httpRequest()
        .get('/@foo/bar3?v=1');
      assert(res.status === 200);

      mockScopedPackage('@foo/bar4');
      res = await app.httpRequest()
        .get('/@foo/bar4/?v');
      assert(res.status === 200);

      mockScopedPackage('@foo/bar5');
      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/bar5')}`);
      assert(res.status === 200);

      mockScopedPackage('@foo/bar6');
      res = await app.httpRequest()
        .get(`/@${encodeURIComponent('foo/bar6')}`);
      assert(res.status === 200);

      mockScopedPackage('@foo1/bar');
      res = await app.httpRequest()
        .get('/@foo1%2fbar');
      assert(res.status === 200);
    });
  });

  describe('GET /{package}/{version}', () => {
    it('should 422 when package name invalid', async () => {
      let res = await app.httpRequest()
        .get('/.foo/latest');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with a period',
      });

      res = await app.httpRequest()
        .get('/@foo/.bar/1.0.0');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with a period',
      });

      res = await app.httpRequest()
        .get('/@foo/_bar/1.0.0');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'name: name cannot start with an underscore',
      });
    });

    it('should 422 when version invalid', async () => {
      let res = await app.httpRequest()
        .get('/@foo%2fbar/ %20');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: required',
      });

      res = await app.httpRequest()
        .get('/@foo%2fbar/a');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: invalid version',
      });

      res = await app.httpRequest()
        .get('/@foo%2fbar/1.0');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: invalid version',
      });

      res = await app.httpRequest()
        .get('/@foo%2fbar/1');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: invalid version',
      });

      res = await app.httpRequest()
        .get('/@foo%2fbar/1.a');
      assert(res.status === 422);
      assert.deepStrictEqual(res.body, {
        error: 'version: invalid version',
      });
    });

    it('should 404 when package version not exists', async () => {
      mockPackageTag('bar', 'latest', '2.0.0');
      let res = await app.httpRequest()
        .get('/bar/latest');
      assert(res.status === 404);

      res = await app.httpRequest()
        .get('/bar/1.0.1-beta.1');
      assert(res.status === 404);

      res = await app.httpRequest()
        .get('/bar/4.0.4');
      assert(res.status === 404);

      res = await app.httpRequest()
        .get('/@foo/bar/4.0.4');
      assert(res.status === 404);
    });

    it('should 200 on normal package', async () => {
      mockPackageVersion('bar', '1.0.0');
      let res = await app.httpRequest()
        .get('/bar/1.0.0');
      assert(res.status === 200);

      mockPackageVersion('bar', '1.0.');
      res = await app.httpRequest()
        .get('/bar/1.0.');
      assert(res.status === 200);

      mockPackageVersion('bar', '1.0.a');
      res = await app.httpRequest()
        .get('/bar/1.0.a');
      assert(res.status === 200);
    });

    it('should 200 on the latest normal package', async () => {
      mockPackageTag('bar', 'latest', '1.0.0');
      mockPackageVersion('bar', '1.0.0');
      const res = await app.httpRequest()
        .get('/bar/latest');
      assert(res.status === 200);
    });

    it('should 200 on the latest scoped package', async () => {
      mockPackageTag('@foo/bar', 'latest', '1.0.0');
      mockPackageVersion('@foo/bar', '1.0.0');
      let res = await app.httpRequest()
        .get('/@foo/bar/latest');
      assert(res.status === 200);

      res = await app.httpRequest()
        .get('/@foo%2fbar/latest');
      assert(res.status === 200);
    });

    it('should 200 on scoped package', async () => {
      mockPackageVersion('@foo/bar', '1.0.0');
      let res = await app.httpRequest()
        .get('/@foo/bar/1.0.0');
      assert(res.status === 200);

      res = await app.httpRequest()
        .get(`/${encodeURIComponent('@foo/bar')}/1.0.0`);
      assert(res.status === 200);

      res = await app.httpRequest()
        .get(`/@${encodeURIComponent('foo/bar')}/1.0.0`);
      assert(res.status === 200);
    });
  });
});

function formatMockVersion(name, version) {
  return {
    id: 111,
    version,
    gmt_modified: new Date(Date.parse('2015-05-16T22:27:54.741Z')),
    gmt_create: new Date(Date.parse('2015-03-24T00:12:24.039Z')),
    package: {
      name,
      version,
      description: 'tiny tarball used for health checks',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      author: {
        name: 'Ben Coe',
        email: 'ben@npmjs.com',
      },
      license: 'ISC',
      _id: `${name}@${version}`,
      _shasum: 'bbf102d5ae73afe2c553295e0fb02230216f65b1',
      _from: '.',
      _npmVersion: '2.7.0',
      _nodeVersion: '1.5.0',
      _npmUser: {
        name: 'bcoe',
        email: 'bencoe@gmail.com',
      },
      maintainers: [
        {
          name: 'bcoe',
          email: 'bencoe@gmail.com',
        },
      ],
      dist: {
        shasum: 'bbf102d5ae73afe2c553295e0fb02230216f65b1',
        tarball: `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`,
      },
      directories: {},
    },
  };
}

function mockPackageVersion(packageName, packageVersion) {
  app.mockService('package', 'getVersion', async (name, version) => {
    assert(packageName === name);
    assert(version);
    return formatMockVersion(packageName, packageVersion);
  });
}

function mockPackageTag(packageName, packageTag, packageVersion) {
  app.mockService('package', 'getTag', async (name, tag) => {
    assert(packageName === name);
    assert(packageTag === tag);
    const version = packageVersion || '1.0.0';
    return {
      id: 1,
      name,
      tag,
      version,
      gmt_create: new Date(Date.parse('2018-08-01T05:43:58.107Z')),
      gmt_modified: new Date(Date.parse('2018-08-01T05:43:58.107Z')),
    };
  });
}

// curl -H 'Accept: application/vnd.npm.install-v1+json' -v https://registry.npmjs.com/tiny-tarball | json
// curl -v https://registry.npmjs.com/tiny-tarball | json
function mockPackage(packageName, maintainers) {
  app.mockService('package', 'get', async name => {
    assert(name === packageName);
    return {
      id: 1,
      name,
      description: 'tiny tarball used for health checks',
      license: 'ISC',
      gmt_modified: new Date(Date.parse('2015-05-16T22:27:54.741Z')),
      gmt_create: new Date(Date.parse('2015-03-24T00:12:24.039Z')),
    };
  });
  app.mockService('package', 'listAllTags', async name => {
    assert(name === packageName);
    return [
      {
        id: 11,
        tag: 'latest',
        version: '1.0.0',
      },
    ];
  });
  app.mockService('package', 'listAllAbbreviatedVersions', async name => {
    assert(name === packageName);
    return [
      {
        id: 111,
        version: '1.0.0',
        gmt_modified: new Date(Date.parse('2015-05-16T22:27:54.741Z')),
        gmt_create: new Date(Date.parse('2015-03-24T00:12:24.039Z')),
        package: {
          name,
          version: '1.0.0',
          _hasShrinkwrap: false,
          directories: {},
          dist: {
            shasum: 'bbf102d5ae73afe2c553295e0fb02230216f65b1',
            tarball: `https://registry.npmjs.org/${name}/-/${name}-1.0.0.tgz`,
          },
        },
      },
    ];
  });
  app.mockService('package', 'listAllVersions', async name => {
    assert(name === packageName);
    return [ formatMockVersion(name, '1.0.0') ];
  });

  app.mockService('package', 'getVersionReadme', async (name, version) => {
    assert(name === packageName);
    return {
      name,
      version,
      readme_filename: 'README.md',
      readme: '# TinyTarball\n\ntiny-tarball used for health checks\n\n**don\'t unpublish me!**\n',
    };
  });

  if (maintainers) {
    app.mockService('package', 'listAllMaintainers', async name => {
      assert(name === packageName);
      return maintainers;
    });
  }
}

// curl -H 'Accept: application/vnd.npm.install-v1+json' -v https://registry.npmjs.com/@koa/cors | json
// curl -v https://registry.npmjs.com/@koa/cors | json
function mockScopedPackage(packageName, maintainers) {
  app.mockService('package', 'get', async name => {
    assert(name === packageName);
    return {
      id: 1,
      name,
      gmt_modified: new Date(Date.parse('2018-08-01T05:43:58.107Z')),
      gmt_create: new Date(Date.parse('2017-09-30T19:49:26.640Z')),
    };
  });
  app.mockService('package', 'listAllTags', async name => {
    assert(name === packageName);
    return [
      {
        id: 2,
        tag: 'latest',
        version: '2.2.2',
      },
    ];
  });
  app.mockService('package', 'listAllAbbreviatedVersions', async name => {
    assert(name === packageName);
    const subName = packageName.split('/')[1];
    return [
      {
        id: 111,
        version: '2.2.1',
        gmt_modified: new Date(Date.parse('2018-08-08T05:43:58.107Z')),
        gmt_create: new Date(Date.parse('2017-09-30T19:49:26.640Z')),
        package: {
          name,
          version: '2.2.1',
          dependencies: {},
          devDependencies: {
            autod: '*',
            contributors: '*',
            istanbul: '*',
            koa: 'next',
            mocha: '*',
            supertest: '1',
            'eslint-config-egg': '^2.0.0',
            eslint: '^2.3.0',
          },
          _hasShrinkwrap: false,
          directories: {},
          dist: {
            integrity: 'sha512-jy8eFnMm3EMkAsCd7B7Csz8AW2TmV3zapXbJB6Z8Pr8AWNaudm+MdBCfoUStE1i/PcpdkutnwZqmr12LJbbVdg==',
            shasum: 'c06a1c34d787e3cee79c0d4c20e8952d1b6d75c5',
            tarball: `https://registry.npmjs.org/${name}/-/${subName}-2.2.1.tgz`,
          },
          engines: {
            node: '>= 4.3.1',
          },
        },
      },
      {
        id: 112,
        version: '2.2.2',
        gmt_modified: new Date(Date.parse('2018-07-11T12:49:35.683Z')),
        gmt_create: new Date(Date.parse('2018-07-11T12:49:35.683Z')),
        package: {
          name,
          version: '2.2.2',
          dependencies: {},
          devDependencies: {
            autod: '*',
            eslint: '^2.3.0',
            'eslint-config-egg': '^2.0.0',
            istanbul: '*',
            koa: '^2.5.1',
            mocha: '3',
            supertest: '^3.1.0',
          },
          _hasShrinkwrap: false,
          directories: {},
          dist: {
            integrity: 'sha512-Ollvsy3wB8+7R9w6hPVzlj3wekF6nK+IHpHj7faSPVXCkahqCwNEPp9+0C4b51RDkdpHjevLEGLOKuVjqtXgSQ==',
            shasum: '9084ab7f58107734e6b19d602d99538eda73f2d0',
            tarball: `https://registry.npmjs.org/${name}/-/${subName}-2.2.2.tgz`,
            fileCount: 5,
            unpackedSize: 9791,
            'npm-signature': '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v3.0.4\r\nComment: https://openpgpjs.org\r\n\r\nwsFcBAEBCAAQBQJbRfzfCRA9TVsSAnZWagAAODEP/3fksoP14/qm1Kb6dilK\npbtC+KNAaGYrx3f/6WR+bzutIZ7r+/XHxEEkLn2Uu964Db0B4MAEFfmc9ODl\nUVxE5IsEGNb2CdXXmZVyem9HYQkQITJrh5SQVlnFdDQZP6+cAdE4m1Gbl857\nNO97YOBtd9iq6UxQnqByfjdUYtfG4S/jj+nog4tFJh/7KiOjYhQ3/03lpxky\nI7VogOefpDI7f/nkDIIbp09hpamuOtNgLBt94eea2UfEt42GFRN8NDqY5PWB\ncuC8kt/ebL0Bgh5wV4koOiCl3gmTNc9a+pWaoCZM01NHudvN8LPdZzBHOkMs\nu7zqY0ftJ74MUUQ12ez9J+m6Cr5mDWVThS7TLZ0D2bch06b8vZkbOwIUgiEN\ndCcYDpj2iNhdAh75Il9nmJmFnVYavmt/CtU922D7J4z7aU5hM6+73dUMXq2D\nG/EBbfKxyXtcN8UUHVW2pH/CidUd/49d1SWFAJ0X/9C0mHEPvCAMsq4BoRIT\nuDasRKgmAIjb3EbIKSklTioaIfYDpRAocedCvhGIBt0GlZ06D//qsbBVKElF\nIor55RqPEYfbnjSWGU1Od+EbGjJahnS4MXuuAZcUsrIbyjGsQHk73uFOut2I\n78fRwVaATg9EAG5wtEXdW4FdLX6FRZIf6S/IqckSPlEmFKKQYH7joUQaljEd\nLToT\r\n=OEAZ\r\n-----END PGP SIGNATURE-----\r\n',
          },
          engines: {
            node: '>= 6.0.0',
          },
        },
      },
    ];
  });

  app.mockService('package', 'listAllVersions', async name => {
    assert(name === packageName);
    const subName = packageName.split('/')[1];
    return [
      {
        id: 1,
        name: '@koa/cors',
        version: '2.2.1',
        gmt_modified: new Date(Date.parse('2017-09-30T19:49:26.640Z')),
        gmt_create: new Date(Date.parse('2017-09-30T19:49:26.640Z')),
        package: {
          name: '@koa/cors',
          version: '2.2.1',
          description: 'Cross-Origin Resource Sharing(CORS) for koa',
          main: 'index.js',
          files: [
            'index.js',
          ],
          scripts: {
            test: 'NODE_ENV=test mocha --check-leaks -R spec -t 5000 test/*.test.js',
            'test-cov': 'NODE_ENV=test istanbul cover _mocha -- --check-leaks -t 5000 test/*.test.js',
            ci: 'npm run lint && npm run test-cov',
            lint: 'eslint index.js test',
            autod: "autod -w --prefix '~'",
            contributors: 'contributors -f plain -o AUTHORS',
          },
          dependencies: {},
          devDependencies: {
            autod: '*',
            contributors: '*',
            istanbul: '*',
            koa: 'next',
            mocha: '*',
            supertest: '1',
            'eslint-config-egg': '^2.0.0',
            eslint: '^2.3.0',
          },
          homepage: 'https://github.com/koajs/cors',
          repository: {
            type: 'git',
            url: 'git://github.com/koajs/cors.git',
          },
          bugs: {
            url: 'https://github.com/koajs/cors/issues',
            email: 'm@fengmk2.com',
          },
          keywords: [
            'cors',
            'koa-cors',
            'Cross-Origin Resource Sharing',
            '@koa/cors',
            'koa',
            'koajs',
          ],
          engines: {
            node: '>= 4.3.1',
          },
          author: {
            name: 'fengmk2',
            email: 'm@fengmk2.com',
            url: 'http://fengmk2.com',
          },
          license: 'MIT',
          contributors: [
            {
              name: 'fengmk2',
              email: 'm@fengmk2.com',
              url: 'https://fengmk2.com',
            },
            {
              name: 'Owen Smith',
              email: 'owen@omsmith.ca',
            },
            {
              name: 'PlasmaPower',
              email: 'ljbousfield@gmail.com',
            },
            {
              name: 'Yiyu He',
              email: 'dead_horse@qq.com',
              url: 'https://github.com/dead-horse',
            },
            {
              name: 'lishengzxc',
              email: 'eric@lishengcn.cn',
              url: 'https://github.com/lishengzxc',
            },
          ],
          gitHead: 'c9825308ce1c76810468bdf5a404b838206fba22',
          _id: '@koa/cors@2.2.1',
          _npmVersion: '5.3.0',
          _nodeVersion: '8.6.0',
          _npmUser: {
            name: 'jongleberry',
            email: 'jonathanrichardong@gmail.com',
          },
          dist: {
            integrity: 'sha512-jy8eFnMm3EMkAsCd7B7Csz8AW2TmV3zapXbJB6Z8Pr8AWNaudm+MdBCfoUStE1i/PcpdkutnwZqmr12LJbbVdg==',
            shasum: 'c06a1c34d787e3cee79c0d4c20e8952d1b6d75c5',
            tarball: `https://registry.npmjs.org/${name}/-/${subName}-2.2.1.tgz`,
          },
          maintainers: [
            {
              name: 'jongleberry',
              email: 'jonathanrichardong@gmail.com',
            },
          ],
          _npmOperationalInternal: {
            host: 's3://npm-registry-packages',
            tmp: 'tmp/cors-2.2.1.tgz_1506800966593_0.3299185351934284',
          },
          directories: {},
        },
      },
      {
        id: 2,
        version: '2.2.2',
        gmt_modified: new Date(Date.parse('2018-08-11T12:49:35.683Z')),
        gmt_create: new Date(Date.parse('2018-07-11T12:49:35.683Z')),
        package: {
          name: '@koa/cors',
          version: '2.2.2',
          description: 'Cross-Origin Resource Sharing(CORS) for koa',
          main: 'index.js',
          files: [
            'index.js',
          ],
          scripts: {
            test: 'NODE_ENV=test mocha --check-leaks -R spec -t 5000 test/*.test.js',
            'test-cov': 'NODE_ENV=test istanbul cover _mocha -- --check-leaks -t 5000 test/*.test.js',
            ci: 'npm run lint && npm run test-cov',
            lint: 'eslint index.js test',
            autod: "autod -w --prefix '^'",
          },
          dependencies: {},
          devDependencies: {
            autod: '*',
            eslint: '^2.3.0',
            'eslint-config-egg': '^2.0.0',
            istanbul: '*',
            koa: '^2.5.1',
            mocha: '3',
            supertest: '^3.1.0',
          },
          homepage: 'https://github.com/koajs/cors',
          repository: {
            type: 'git',
            url: 'git://github.com/koajs/cors.git',
          },
          bugs: {
            url: 'https://github.com/koajs/cors/issues',
          },
          keywords: [
            'cors',
            'koa-cors',
            'Cross-Origin Resource Sharing',
            '@koa/cors',
            'koa',
            'koajs',
          ],
          engines: {
            node: '>= 6.0.0',
          },
          author: {
            name: 'fengmk2',
            email: 'fengmk2@gmail.com',
            url: 'http://fengmk2.com',
          },
          license: 'MIT',
          gitHead: 'b5a937fc24666761c61b1ac633f49f54612d1315',
          _id: '@koa/cors@2.2.2',
          _npmVersion: '5.5.1',
          _nodeVersion: '8.4.0',
          _npmUser: {
            name: 'fengmk2',
            email: 'fengmk2@gmail.com',
          },
          dist: {
            integrity: 'sha512-Ollvsy3wB8+7R9w6hPVzlj3wekF6nK+IHpHj7faSPVXCkahqCwNEPp9+0C4b51RDkdpHjevLEGLOKuVjqtXgSQ==',
            shasum: '9084ab7f58107734e6b19d602d99538eda73f2d0',
            tarball: `https://registry.npmjs.org/${name}/-/${subName}-2.2.2.tgz`,
            fileCount: 5,
            unpackedSize: 9791,
            'npm-signature': '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v3.0.4\r\nComment: https://openpgpjs.org\r\n\r\nwsFcBAEBCAAQBQJbRfzfCRA9TVsSAnZWagAAODEP/3fksoP14/qm1Kb6dilK\npbtC+KNAaGYrx3f/6WR+bzutIZ7r+/XHxEEkLn2Uu964Db0B4MAEFfmc9ODl\nUVxE5IsEGNb2CdXXmZVyem9HYQkQITJrh5SQVlnFdDQZP6+cAdE4m1Gbl857\nNO97YOBtd9iq6UxQnqByfjdUYtfG4S/jj+nog4tFJh/7KiOjYhQ3/03lpxky\nI7VogOefpDI7f/nkDIIbp09hpamuOtNgLBt94eea2UfEt42GFRN8NDqY5PWB\ncuC8kt/ebL0Bgh5wV4koOiCl3gmTNc9a+pWaoCZM01NHudvN8LPdZzBHOkMs\nu7zqY0ftJ74MUUQ12ez9J+m6Cr5mDWVThS7TLZ0D2bch06b8vZkbOwIUgiEN\ndCcYDpj2iNhdAh75Il9nmJmFnVYavmt/CtU922D7J4z7aU5hM6+73dUMXq2D\nG/EBbfKxyXtcN8UUHVW2pH/CidUd/49d1SWFAJ0X/9C0mHEPvCAMsq4BoRIT\nuDasRKgmAIjb3EbIKSklTioaIfYDpRAocedCvhGIBt0GlZ06D//qsbBVKElF\nIor55RqPEYfbnjSWGU1Od+EbGjJahnS4MXuuAZcUsrIbyjGsQHk73uFOut2I\n78fRwVaATg9EAG5wtEXdW4FdLX6FRZIf6S/IqckSPlEmFKKQYH7joUQaljEd\nLToT\r\n=OEAZ\r\n-----END PGP SIGNATURE-----\r\n',
          },
          maintainers: [
            {
              email: 'aaron.heckmann+github@gmail.com',
              name: 'aaron',
            },
            {
              email: 'haoxins@outlook.com',
              name: 'coderhaoxin',
            },
            {
              email: 'dead_horse@qq.com',
              name: 'dead_horse',
            },
            {
              email: 'dead_horse@qq.com',
              name: 'dead-horse',
            },
            {
              email: 'eivind.fjeldstad@gmail.com',
              name: 'eivifj',
            },
            {
              email: 'fengmk2@gmail.com',
              name: 'fengmk2',
            },
            {
              email: 'jonathanrichardong@gmail.com',
              name: 'jongleberry',
            },
            {
              email: 'julian@juliangruber.com',
              name: 'juliangruber',
            },
            {
              email: 'tj@vision-media.ca',
              name: 'tjholowaychuk',
            },
          ],
          directories: {},
          _npmOperationalInternal: {
            host: 's3://npm-registry-packages',
            tmp: 'tmp/cors_2.2.2_1531313375625_0.6766918754651792',
          },
        },
      },
    ];
  });

  if (maintainers) {
    app.mockService('package', 'listAllMaintainers', async name => {
      assert(name === packageName);
      return maintainers;
    });
  }
}
