'use strict';

const _ = require('lodash');
const dateComponent = require('hof').components.date;
const after1900Validator = { type: 'after', arguments: ['1900'] };
const countries = require('hof').utils.countries().concat([{ value: 'Unknown', label: 'Unknown' }]);
const isInCountriesList = value => countries.some(country => country.value === value);

module.exports = {
  'who-completing-form': {
    isPageHeading: true,
    mixin: 'radio-group',
    options: ['the-referrer', 'someone-helping', 'immigration-advisor'],
    validate: 'required'
  },
  'full-name': {
    // SKELETON: for the purposes of the Skeleton this page is used to determine under/over 18
    mixin: 'radio-group',
    options: ['under-18', 'over-18'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'confirm-referrer-email': {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  partner: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  children: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  parent: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'parent-full-name': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'parent-phone-number': {
    labelClassName: 'bold',
    validate: ['internationalPhoneNumber', { type: 'maxlength', arguments: [250] }],
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  'parent-email': {
    labelClassName: 'bold',
    validate: ['email']
  },
  'parent-date-of-birth': dateComponent('parent-date-of-birth', {
    legend: { className: 'bold' },
    validate: ['required', 'before', after1900Validator]
  }),
  'parent-country': {
    labelClassName: 'bold',
    mixin: 'select',
    validate: ['required', isInCountriesList],
    className: ['typeahead', 'js-hidden'],
    options: [
      {
        value: '',
        label: 'fields.parent-country.options.null'
      }
    ].concat(_.sortBy(countries, o => o.label))
  },
  'parent-evacuated-without-reason': {
    labelClassName: 'bold',
    mixin: 'textarea',
    attributes: [{ attribute: 'rows', value: 5 }],
    validate: [
      'required',
      'notUrl',
      { type: 'regex', arguments: /^[^\[\]\|<>]*$/ },
      { type: 'maxlength', arguments: 15000 }
    ]
  },
  'brother-or-sister': {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'additional-family': {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'no-family-referred': {
    // SKELETON: for the purposes of the Skeleton this page is used to determine
    // under/over 18 and return to parent/partner flow
    mixin: 'radio-group',
    options: ['under-18', 'over-18'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'family-in-uk': {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'how-send-decision': {
    mixin: 'radio-group',
    options: ['email', 'post'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  }
};
