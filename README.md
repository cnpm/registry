# cnpm-registry

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Build Status](https://dev.azure.com/eggjs/egg/_apis/build/status/cnpm.registry.cnpmjs.org)](https://dev.azure.com/eggjs/egg/_build/latest?definitionId=9)
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: http://cnpmjs.org/badge/v/cnpm-registry.svg?style=flat-square
[npm-url]: http://cnpmjs.org/package/cnpm-registry
[travis-image]: https://img.shields.io/travis/cnpm/registry.svg?style=flat-square
[travis-url]: https://travis-ci.org/cnpm/registry
[codecov-image]: https://codecov.io/gh/cnpm/registry/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/cnpm/registry
[david-image]: https://img.shields.io/david/cnpm/registry.svg?style=flat-square
[david-url]: https://david-dm.org/cnpm/registry
[snyk-image]: https://snyk.io/test/npm/cnpm-registry/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/cnpm-registry
[download-image]: https://img.shields.io/npm/dm/cnpm-registry.svg?style=flat-square
[download-url]: https://npmjs.org/package/cnpm-registry

Private npm registry for Enterprise, base on eggjs

## QuickStart

### Database

- install mysql and create database

**Require: MySQL 5.6.4+**
> DATETIME(6): Fractional seconds support with up to 6 digits of precision

```bash
brew install mysql # macOS
brew service start mysql

mysql -u root -e 'CREATE DATABASE IF NOT EXISTS `cnpm_registry_dev` DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;'
mysql -u root -e 'CREATE DATABASE IF NOT EXISTS `cnpm_registry_unittest` DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;'
```

> [What's the difference between utf8_general_ci and utf8_unicode_ci](https://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci)

- install dependencies

```bash
npm i
```

### Init database with Migrations

```bash
# for local env
npm run db:migrate
# for unittest env
NODE_ENV=test npm run db:migrate
```

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

## Migrations

See http://docs.sequelizejs.com/manual/tutorial/migrations.html

### Generate a new migration

```bash
node_modules/.bin/sequelize migration:generate --name {name}
```

### Running Migrations

```bash
node_modules/.bin/sequelize db:migrate
```

### Undoing Migrations

```bash
node_modules/.bin/sequelize db:migrate:undo
```

## FQA

- What's the package name string length limit to 214?
> A: And npm allow package name up to [214 characters](https://docs.npmjs.com/files/package.json#name).

- Why use `CHARSET=ascii` on package `name` and `version` column?
> A: MySQL max index length is 767 bytes, if we use `utf8mb4` charset by default,
> the `name` + `version` union index key(214 * 4 + 100 * 4 = 1256) will exceed the MySQL index length limit.
> And The `name` ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the `name` can't contain any non-URL-safe characters.
> So we can use `ascii` charset to store `name` and `version` on MySQL. The max length is 314 bytes.

## MySQL Character Set

Run below command to check all charset in your MySQL

```bash
mysql -u root -e 'show character set;';

+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
| dec8     | DEC West European               | dec8_swedish_ci     |      1 |
| cp850    | DOS West European               | cp850_general_ci    |      1 |
| hp8      | HP West European                | hp8_english_ci      |      1 |
| koi8r    | KOI8-R Relcom Russian           | koi8r_general_ci    |      1 |
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European     | latin2_general_ci   |      1 |
| swe7     | 7bit Swedish                    | swe7_swedish_ci     |      1 |
| ascii    | US ASCII                        | ascii_general_ci    |      1 |
| ujis     | EUC-JP Japanese                 | ujis_japanese_ci    |      3 |
| sjis     | Shift-JIS Japanese              | sjis_japanese_ci    |      2 |
| hebrew   | ISO 8859-8 Hebrew               | hebrew_general_ci   |      1 |
| tis620   | TIS620 Thai                     | tis620_thai_ci      |      1 |
| euckr    | EUC-KR Korean                   | euckr_korean_ci     |      2 |
| koi8u    | KOI8-U Ukrainian                | koi8u_general_ci    |      1 |
| gb2312   | GB2312 Simplified Chinese       | gb2312_chinese_ci   |      2 |
| greek    | ISO 8859-7 Greek                | greek_general_ci    |      1 |
| cp1250   | Windows Central European        | cp1250_general_ci   |      1 |
| gbk      | GBK Simplified Chinese          | gbk_chinese_ci      |      2 |
| latin5   | ISO 8859-9 Turkish              | latin5_turkish_ci   |      1 |
| armscii8 | ARMSCII-8 Armenian              | armscii8_general_ci |      1 |
| utf8     | UTF-8 Unicode                   | utf8_general_ci     |      3 |
| ucs2     | UCS-2 Unicode                   | ucs2_general_ci     |      2 |
| cp866    | DOS Russian                     | cp866_general_ci    |      1 |
| keybcs2  | DOS Kamenicky Czech-Slovak      | keybcs2_general_ci  |      1 |
| macce    | Mac Central European            | macce_general_ci    |      1 |
| macroman | Mac West European               | macroman_general_ci |      1 |
| cp852    | DOS Central European            | cp852_general_ci    |      1 |
| latin7   | ISO 8859-13 Baltic              | latin7_general_ci   |      1 |
| utf8mb4  | UTF-8 Unicode                   | utf8mb4_general_ci  |      4 |
| cp1251   | Windows Cyrillic                | cp1251_general_ci   |      1 |
| utf16    | UTF-16 Unicode                  | utf16_general_ci    |      4 |
| utf16le  | UTF-16LE Unicode                | utf16le_general_ci  |      4 |
| cp1256   | Windows Arabic                  | cp1256_general_ci   |      1 |
| cp1257   | Windows Baltic                  | cp1257_general_ci   |      1 |
| utf32    | UTF-32 Unicode                  | utf32_general_ci    |      4 |
| binary   | Binary pseudo charset           | binary              |      1 |
| geostd8  | GEOSTD8 Georgian                | geostd8_general_ci  |      1 |
| cp932    | SJIS for Windows Japanese       | cp932_japanese_ci   |      2 |
| eucjpms  | UJIS for Windows Japanese       | eucjpms_japanese_ci |      3 |
| gb18030  | China National Standard GB18030 | gb18030_chinese_ci  |      4 |
+----------+---------------------------------+---------------------+--------+
```

### License

[MIT](LICENSE)


[egg]: https://eggjs.org
