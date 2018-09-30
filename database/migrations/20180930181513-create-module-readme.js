'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.sequelize.query(`
CREATE TABLE IF NOT EXISTS \`module_readme\` (
  \`id\` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  \`gmt_create\` datetime(6) NOT NULL COMMENT 'create time',
  \`gmt_modified\` datetime(6) NOT NULL COMMENT 'modified time',
  \`name\` varchar(214) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module name',
  \`version\` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT 'module version',
  \`readme\` longtext COMMENT 'the module version readme',
  \`readme_filename\` varchar(100) NOT NULL COMMENT 'readme filename',
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_name_version\` (\`name\`, \`version\`),
  KEY \`idx_gmt_modified\` (\`gmt_modified\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='module version readme';
    `);
  },

  down: async queryInterface => {
    await queryInterface.dropTable('module_readme');
  },
};
