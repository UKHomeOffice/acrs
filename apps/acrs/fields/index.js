'use strict';

const _ = require('lodash');
const dateComponent = require('hof').components.date;
const after1900Validator = { type: 'after', arguments: ['1900'] };
const countries = require('hof').utils.countries().concat([{ value: 'Unknown', label: 'Unknown' }]);
const isInCountriesList = value => countries.some(country => country.value === value);

module.exports = {
  isInCountriesList,
  'who-completing-form': {
    isPageHeading: true,
    mixin: 'radio-group',
    options: ['the-referrer', 'someone-helping', 'immigration-advisor'],
    validate: 'required'
  },
  'helper-full-name': {
    labelClassName: 'bold',
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 250 }]
  },
  'helper-relationship': {
    labelClassName: 'bold',
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 250 }]
  },
  'helper-organisation': {
    labelClassName: 'bold',
    validate: ['notUrl', { type: 'maxlength', arguments: 250 }]
  },
  'full-name': {
    isPageHeading: true,
    mixin: 'input-text',
    validate: ['required', { type: 'maxlength', arguments: 250 }]
  },
  'confirm-referrer-email': {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'referrer-email-options': {
    mixin: 'radio-group',
    options: [
      {
        value: 'yes',
        toggle: 'referrer-email-address',
        child: 'input-text'
      },
      {
        value: 'no'
      }
    ],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'referrer-email-address': {
    dependent: {
      field: 'referrer-email-options',
      value: 'yes'
    },
    validate: ['required', 'email', { type: 'maxlength', arguments: 254 }]
  },
  'your-address-line-1': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'your-address-line-2': {
    validate: ['notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'your-address-town-or-city': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'your-address-postcode': {
    validate: ['required', 'notUrl', 'postcode'],
    labelClassName: 'bold',
    className: ['govuk-input', 'govuk-input--width-10']
  },
  partner: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'provide-telephone-number-options': {
    mixin: 'radio-group',
    options: [
      {
        value: 'yes',
        toggle: 'provide-telephone-number-number',
        child: 'input-text'
      },
      {
        value: 'no'
      }
    ],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'provide-telephone-number-number': {
    dependent: {
      field: 'provide-telephone-number-options',
      value: 'yes'
    },
    validate: ['required', 'internationalPhoneNumber', { type: 'maxlength', arguments: 20 }]
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
    isPageHeading: true
  },
  'parent-full-name': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'parent-phone-number': {
    labelClassName: 'bold',
    validate: ['internationalPhoneNumber', { type: 'maxlength', arguments: [250] }],
    className: ['govuk-input', 'govuk-!-width-one-half']
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
    className: ['js-hidden'],
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
  },
  'immigration-adviser-details': {
    isPageHeading: true
  },
  'legal-representative-phone-number': {
    labelClassName: 'bold',
    validate: ['required', 'internationalPhoneNumber', { type: 'maxlength', arguments: [200] }],
    includeInSummary: false,
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  'legal-representative-fullname': {
    labelClassName: 'bold',
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    includeInSummary: false,
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  'legal-representative-organisation': {
    labelClassName: 'bold',
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    includeInSummary: false,
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  'legal-representative-house-number': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 200 }],
    includeInSummary: false
  },
  'legal-representative-street': {
    validate: ['notUrl', { type: 'maxlength', arguments: 250 }],
    includeInSummary: false
  },
  'legal-representative-townOrCity': {
    validate: ['required', 'notUrl',
      { type: 'regex', arguments: /^([^0-9]*)$/ },
      { type: 'maxlength', arguments: 250 }
    ],
    includeInSummary: false,
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  'legal-representative-county': {
    validate: ['notUrl',
      { type: 'regex', arguments: /^([^0-9]*)$/ },
      { type: 'maxlength', arguments: 250 }
    ],
    includeInSummary: false,
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  'legal-representative-postcode': {
    validate: ['required', 'postcode', { type: 'maxlength', arguments: [200] }],
    formatter: ['ukPostcode'],
    includeInSummary: false,
    className: ['govuk-input', 'govuk-input--width-10'],
    validationLink: {
      field: ''
    }
  },
  'is-legal-representative-email': {
    isPageHeading: true,
    mixin: 'radio-group',
    validate: ['required'],
    legend: {
      className: 'visuallyhidden'
    },
    options: [{
      value: 'yes'
    }, {
      value: 'no',
      toggle: 'legal-representative-email-details-fieldset',
      child: 'partials/legal-representative-email-details'
    }]
  }
};
