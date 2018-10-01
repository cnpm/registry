'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/validator_rule.test.js', () => {
  describe('packageName', () => {
    it('should not allow contains %', () => {
      let errors = app.validator.validate({ name: 'packageName' }, { name: 'foo%' });
      assert(errors);
      assert(errors[0].message === 'name must not contain %');

      errors = app.validator.validate({ name: 'packageName' }, { name: 'foo%foo' });
      assert(errors);
      assert(errors[0].message === 'name must not contain %');
    });

    it('should not allow contains @ on scoped package subname', () => {
      let errors = app.validator.validate({ name: 'packageName' }, { name: '@foo/bar@' });
      assert(errors);
      assert(errors[0].message === 'name can only contain URL-friendly characters');

      errors = app.validator.validate({ name: 'packageName' }, { name: '@foo/@bar' });
      assert(errors);
      assert(errors[0].message === 'name can only contain URL-friendly characters');
    });
  });

  describe('packageVersion', () => {
    it('should allow `latest` as version', async () => {
      assert(!app.validator.validate({ version: 'packageVersion' }, { version: 'latest' }));
    });

    it('should pass on semver version', async () => {
      [
        '1.0.0',
        '0.0.0',
        '0.0.0',
        '1.0.0-beta.1',
        '1000.99.100',
        '100.22.33-rc.0',
        '2.0.3-rc1',
        '2.0.3.123123',
      ].forEach(version => {
        const errors = app.validator.validate({ version: 'packageVersion' }, { version });
        assert(!(errors && errors[0]), version);
      });
    });

    it('should detect invalid version', async () => {
      [
        '1',
        '0.0',
        '1.a.1',
        '1000.b.100',
        '100.-.',
        '...',
        'a.b.c',
      ].forEach(version => {
        const errors = app.validator.validate({ version: 'packageVersion' }, { version });
        assert(errors);
        assert(errors[0].message === 'invalid version');
      });
    });
  });
});
