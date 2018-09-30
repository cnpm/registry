'use strict';

const http = require('http');

module.exports = {
  httpError(status, message) {
    message = message || http.STATUS_CODES[status];
    const err = new Error(message);
    err.status = status;
    return err;
  },

  badRequestError(message) {
    return this.httpError(400, message);
  },

  notFoundError(message) {
    return this.httpError(404, message);
  },

  unauthorizedError(message) {
    return this.httpError(401, message);
  },

  validateParams(rules, params) {
    const errors = this.app.validator.validate(rules, params);
    if (errors) {
      const error = errors[0];
      if (!error.message) error.message = `${error.field} ${error.code}`;
      const err = new Error(`${error.field}: ${error.message}`);
      err.name = 'ValidateParamsError';
      err.code = error.code;
      err.status = error.status || 422;
      throw err;
    }
  },

  // permit and validate params, if invalid will throw error to stop the request
  // const params = ctx.permitAndValidateParams({
  //   target_type: 'string',
  //   target_id: 'string',
  //   offset: { type: 'int', required: false },
  //   limit: { type: 'int', required: false },
  // }, params);
  permitAndValidateParams(rules, params) {
    this.validateParams(rules, params);
    // ignore all undefined fields
    const validParams = {};
    for (const field in rules) {
      const value = params[field];
      if (value !== undefined) {
        validParams[field] = value;
      }
    }
    return validParams;
  },
};
