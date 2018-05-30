'use strict';

module.exports = app => {
  if (app.config.env === 'local') {
    app.beforeStart(async () => {
      console.log(app.sequelize);
      await app.model.sync({
        force: true,
      });
    });
  }
};
