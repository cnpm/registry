'use strict';

module.exports = (_, app) => {
  return async function auth(ctx, next) {
    let authorization = ctx.get('authorization').split(' ')[1] || '';
    authorization = authorization.trim();
    if (!authorization) {
      if (app.config.alwaysAuth) throw ctx.unauthorizedError();
      return next();
    }

    authorization = Buffer.from(authorization, 'base64').toString();
    const pos = authorization.indexOf(':');
    if (pos === -1) throw ctx.unauthorizedError();

    const username = authorization.slice(0, pos);
    const password = authorization.slice(pos + 1);

    const user = await ctx.service.user.auth(username, password);
    if (!user) throw ctx.unauthorizedError();

    if (typeof user.toJSON === 'function') {
      ctx.user = user.toJSON();
    } else {
      ctx.user = user;
    }
    return next();
  };
};
