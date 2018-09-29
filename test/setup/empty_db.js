'use strict';

const QueryInterface = require('sequelize/lib/query-interface');

const dbTableNameToModelNames = {};

// record insert tables
let dbInsertTables = {};
// override QueryInterface insert and upsert
const _insert = QueryInterface.prototype.insert;
const _update = QueryInterface.prototype.update;
const _upsert = QueryInterface.prototype.upsert;
const _bulkInsert = QueryInterface.prototype.bulkInsert;
const _bulkUpdate = QueryInterface.prototype.bulkUpdate;
// (instance, tableName, values, options)
QueryInterface.prototype.insert = function(...args) {
  // console.error('insert', args[1]);
  dbInsertTables[args[1]] = 1;
  return _insert.apply(this, args);
};
// (instance, tableName, values, identifier, options)
QueryInterface.prototype.update = function(...args) {
  // console.error('update', args[1]);
  dbInsertTables[args[1]] = 1;
  return _update.apply(this, args);
};

// (tableName, valuesByField, updateValues, where, model, options)
QueryInterface.prototype.upsert = function(...args) {
  // console.error('upsert', args[0]);
  dbInsertTables[args[0]] = 1;
  return _upsert.apply(this, args);
};
// (tableName, records, options, attributes)
QueryInterface.prototype.bulkInsert = function(...args) {
  // console.error('bulkInsert', args[0]);
  dbInsertTables[args[0]] = 1;
  return _bulkInsert.apply(this, args);
};
// (tableName, values, identifier, options, attributes)
QueryInterface.prototype.bulkUpdate = function(...args) {
  // console.error('bulkUpdate', args[0]);
  dbInsertTables[args[0]] = 1;
  return _bulkUpdate.apply(this, args);
};

exports.emptyAll = async ctx => {
  const tasks = [];
  const names = Object.keys(ctx.model.models);
  for (const ModelName of names) {
    const Model = ctx.model[ModelName];
    if (Model && typeof Model.destroy === 'function') {
      tasks.push(Model.destroy({ truncate: true, force: true }));
    }
  }
  await Promise.all(tasks);
};

exports.emptyChanged = async ctx => {
  const tasks = [];
  // console.error('update tables: %j', Object.keys(insertTables))
  for (const tableName in dbInsertTables) {
    const ModelName = dbTableNameToModelNames[tableName];
    if (ModelName === 'Total') continue;
    tasks.push(ctx.model[ModelName].destroy({ truncate: true, force: true }));
  }
  await Promise.all(tasks);

  dbInsertTables = {};
};

exports.init = async ctx => {
  for (const name in ctx.model.models) {
    dbTableNameToModelNames[ctx.model.models[name].getTableName()] = name;
  }
  await exports.emptyAll(ctx);
};
