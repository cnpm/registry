'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/validator_rule.test.js', () => {
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
