-- download.js -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `downloads` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
  `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
  `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
  `date` int unsigned NOT NULL COMMENT 'YYYYMM format',
  `d01` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '01 download count',
  `d02` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '02 download count',
  `d03` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '03 download count',
  `d04` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '04 download count',
  `d05` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '05 download count',
  `d06` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '06 download count',
  `d07` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '07 download count',
  `d08` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '08 download count',
  `d09` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '09 download count',
  `d10` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '10 download count',
  `d11` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '11 download count',
  `d12` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '12 download count',
  `d13` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '13 download count',
  `d14` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '14 download count',
  `d15` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '15 download count',
  `d16` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '16 download count',
  `d17` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '17 download count',
  `d18` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '18 download count',
  `d19` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '19 download count',
  `d20` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '20 download count',
  `d21` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '21 download count',
  `d22` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '22 download count',
  `d23` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '23 download count',
  `d24` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '24 download count',
  `d25` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '25 download count',
  `d26` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '26 download count',
  `d27` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '27 download count',
  `d28` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '28 download count',
  `d29` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '29 download count',
  `d30` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '30 download count',
  `d31` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '31 download count',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name_date` (`name`, `date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module download total info';

-- module_abbreviated_version.js -----------------------------------------------

CREATE TABLE IF NOT EXISTS `module_abbreviated` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `version` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module version',
 `package` longtext COMMENT 'the abbreviated metadata',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name_version` (`name`,`version`),
 KEY `idx_gmt_modified` (`gmt_modified`),
 KEY `idx_gmt_create` (`gmt_create`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module abbreviated info';

-- module_deps.js --------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `module_deps` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `deps` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'which module depend on this module',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name_deps` (`name`,`deps`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module deps';

-- module_keyword.js -----------------------------------------------------------

CREATE TABLE IF NOT EXISTS `module_keyword` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `keyword` varchar(100) NOT NULL COMMENT 'keyword',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `description` longtext COMMENT 'module description',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_keyword_module_name` (`keyword`,`name`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module keyword';

-- module_log.js ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `module_log` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `username` varchar(100) NOT NULL COMMENT 'which username',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `log` longtext COMMENT 'the raw log',
 PRIMARY KEY (`id`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module sync log';

-- module_maintainer.js --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `module_maintainer` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `user` varchar(100) NOT NULL COMMENT 'user name',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_user_module_name` (`user`,`name`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='private module maintainers';

-- module_star.js --------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `module_star` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `user` varchar(100) NOT NULL COMMENT 'user name',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_user_module_name` (`user`,`name`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module star';

-- module_unpublished.js -------------------------------------------------------

CREATE TABLE IF NOT EXISTS `module_unpublished` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `package` longtext COMMENT 'base info: tags, time, maintainers, description, versions',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name` (`name`),
 KEY `idx_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module unpublished info';

-- module_version.js -----------------------------------------------------------

CREATE TABLE IF NOT EXISTS `module` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `author` varchar(100) NOT NULL COMMENT 'module author',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `version` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module version',
 `description` longtext COMMENT 'module description',
 `package` longtext COMMENT 'package.json',
 `dist_shasum` varchar(100) DEFAULT NULL COMMENT 'module dist SHASUM',
 `dist_tarball` varchar(2048) DEFAULT NULL COMMENT 'module dist tarball',
 `dist_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'module dist size',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name_version` (`name`,`version`),
 KEY `idx_gmt_modified` (`gmt_modified`),
 KEY `idx_gmt_create` (`gmt_create`),
 KEY `idx_author` (`author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module version info';

-- module_version_readme.js ----------------------------------------------------

CREATE TABLE IF NOT EXISTS `module_readme` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `version` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module version',
 `readme` longtext COMMENT 'the module version readme',
 `readme_filename` varchar(100) NOT NULL COMMENT 'readme filename',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name_version` (`name`, `version`),
 KEY `idx_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module version readme';

-- npm_module_maintainer.js ----------------------------------------------------

CREATE TABLE IF NOT EXISTS `npm_module_maintainer` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `user` varchar(100) NOT NULL COMMENT 'user name',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_user_module_name` (`user`,`name`),
 KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='npm original module maintainers';

-- package.js ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `package` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'package name',
 `author` varchar(100) NOT NULL COMMENT 'first publish author name',
 `description` longtext COMMENT 'module description',
 `license` varchar(100) NOT NULL COMMENT 'license of the package',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name` (`name`),
 KEY `idx_gmt_modified` (`gmt_modified`),
 KEY `idx_author` (`author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='package info';

-- package_readme.js -----------------------------------------------------------

CREATE TABLE IF NOT EXISTS `package_readme` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
 `version` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module version',
 `readme` longtext COMMENT 'the latest version readme',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name` (`name`),
 KEY `idx_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='package latest readme';

-- tag.js ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tag` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'package name',
 `tag` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'tag name',
 `version` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'package version',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name_tag` (`name`, `tag`),
 KEY `idx_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='package tag';

-- total.js --------------------------------------------------------------------

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

-- user.js ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime(6) NOT NULL COMMENT 'create time',
 `gmt_modified` datetime(6) NOT NULL COMMENT 'modified time',
 `name` varchar(100) NOT NULL COMMENT 'user name',
 `salt` varchar(100) NOT NULL COMMENT 'user salt',
 `password_sha` varchar(100) NOT NULL COMMENT 'user password hash, 64 len is sha256, 40 len is sha1',
 `ip` varchar(64) NOT NULL COMMENT 'user last request ip',
 `roles` varchar(200) NOT NULL DEFAULT '[]' COMMENT 'user roles',
 `email` varchar(400) NOT NULL COMMENT 'user email',
 `json` longtext COMMENT 'json details',
 `npm_user` tinyint(1) DEFAULT '0' COMMENT 'user sync from npm or not, 1: true, other: false',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uk_name` (`name`),
 KEY `idx_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='user base info';