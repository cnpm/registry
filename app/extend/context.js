'use strict';

module.exports = {
  validateParams(rules, params) {
    const errors = this.app.validator.validate(rules, params || this.params);
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
  // });
  permitAndValidateParams(rules) {
    const fields = Object.keys(rules);
    const params = this.params.permit(fields);
    this.validateParams(rules, params);
    // ignore all undefined fields
    const validParams = {};
    for (const field of fields) {
      const value = params[field];
      if (value !== undefined) {
        validParams[field] = value;
      }
    }
    return validParams;
  },
};
