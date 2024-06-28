'use strict';

const dateComponent = require('hof').components.date;
const UANValidator = { type: 'regex', arguments: /^(\d{4}-\d{4}-\d{4}-\d{4})$/ };
const BRPValidator = { type: 'regex', arguments: /^r[a-z](\d|X)\d{6}$/gi };
const after1900Validator = { type: 'after', arguments: ['1900'] };

module.exports = {
  'sign-in-method': {
    mixin: 'radio-group',
    options: ['brp', 'uan'],
    validate: 'required'
  },
  brp: {
    validate: ['required', BRPValidator],
    labelClassName: 'bold'
  },
  uan: {
    validate: ['required', UANValidator],
    labelClassName: 'bold'
  },
  'date-of-birth': dateComponent('date-of-birth', {
    mixin: 'input-date',
    legend: {
      className: 'bold'
    },
    validate: ['required', 'before', after1900Validator]
  }),
  'user-email': {
    labelClassName: 'visuallyhidden',
    validate: ['required', 'email'],
    formatter: ['lowercase']
  }
};
