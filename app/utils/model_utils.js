'use strict';

exports.JSONGetter = propertyName => {
  return function JSONGetter() {
    let value = this.getDataValue(propertyName);
    if (value && typeof value === 'string') {
      value = JSON.parse(value);
    }
    return value;
  };
};

exports.JSONSetter = propertyName => {
  return function JSONSetter(value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    this.setDataValue(propertyName, value);
  };
};
