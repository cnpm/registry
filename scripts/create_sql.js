'use strict';

const fs = require('fs');
const path = require('path');

const COMMENT_RE = /\/\*([\s\S]+?)\*\//m;
const modelDir = path.join(__dirname, '../app/model');
const filenames = fs.readdirSync(modelDir);
const sqls = [];

for (const filename of filenames) {
  const filepath = path.join(modelDir, filename);
  const filecontent = fs.readFileSync(filepath, 'utf8');
  const m = COMMENT_RE.exec(filecontent);
  if (!m) throw new Error(`${filepath} missing the SQL comment`);
  sqls.push(`-- ${filename} ${'-'.repeat(76 - filename.length)}`);
  sqls.push(m[1].trim());
}

const sql = sqls.join('\n\n');
const sqlpath = path.join(__dirname, '../database/tables.sql');
console.log('[create_sql] Save Create Table SQL to %s', sqlpath);
fs.writeFileSync(sqlpath, sql);
