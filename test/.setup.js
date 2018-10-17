'use strict';

const emptyDB = require('./setup/empty_db');
const { app } = require('egg-mock/bootstrap');

before(async () => {
  // clean all exists datas
  await emptyDB.init(app.mockContext());
  await app.model.Total.init();

  app.mockUser = function(user) {
    app.mockContext({ user });
  };
});

beforeEach(async () => {
  // clean all changed datas
  await emptyDB.emptyChanged(app.mockContext());
});
