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
  partner: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  'partner-full-name': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'partner-phone-number': {
    labelClassName: 'bold',
    validate: ['internationalPhoneNumber', { type: 'maxlength', arguments: [250] }],
    className: ['govuk-input', 'govuk-!-width-one-half']
  },
  'partner-email': {
    labelClassName: 'bold',
    validate: ['email']
  },
  'partner-date-of-birth': dateComponent('partner-date-of-birth', {
    legend: { className: 'bold' },
    validate: ['required', 'before', after1900Validator]
  }),
  'partner-country': {
    labelClassName: 'bold',
    mixin: 'select',
    validate: ['required', isInCountriesList],
    className: ['js-hidden'],
    options: [
      {
        value: '',
        label: 'fields.partner-country.options.null'
      }
    ].concat(_.sortBy(countries, o => o.label))
  },
  'partner-living-situation': {
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
  'partner-why-without-partner': {
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
  children: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: { className: 'bold' }
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
  'error-field': {},
  'brother-or-sister': {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    isPageHeading: true
  },
  'brother-or-sister-full-name': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'brother-or-sister-date-of-birth': dateComponent('brother-or-sister-date-of-birth', {
    legend: { className: 'bold' },
    validate: [
      'required',
      'before',
      { type: 'after', arguments: ['2003-08-27'] }]
  }),
  'brother-or-sister-country': {
    labelClassName: 'bold',
    mixin: 'select',
    validate: ['required', isInCountriesList],
    className: ['js-hidden'],
    options: [
      {
        value: '',
        label: 'fields.brother-or-sister-country.options.null'
      }
    ].concat(_.sortBy(countries, o => o.label))
  },
  'brother-or-sister-evacuated-without-reason': {
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
  'additional-family': {
    legend: { className: 'bold' },
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
  },
  'additional-family-full-name': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'additional-family-date-of-birth': dateComponent('additional-family-date-of-birth', {
    legend: { className: 'bold' },
    validate: ['required', 'before', after1900Validator]
  }),
  'additional-family-relationship': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: [250] }],
    labelClassName: 'bold'
  },
  'additional-family-country': {
    labelClassName: 'bold',
    mixin: 'select',
    validate: ['required', isInCountriesList],
    className: ['js-hidden'],
    options: [
      {
        value: '',
        label: 'fields.additional-family-country.options.null'
      }
    ].concat(_.sortBy(countries, o => o.label))
  },
  'additional-family-living-situation': {
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
  'additional-family-needs-support': {
    legend: { className: 'bold' },
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
  },
  'additional-family-why-evac-without': {
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
  'additional-family-why-referring': {
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
  'has-family-in-uk': {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'bold'
    }
  },
  'family-member-fullname': {
    labelClassName: 'bold',
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 250 }],
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  'family-member-date-of-birth': dateComponent('family-member-date-of-birth', {
    legend: {
      className: 'bold'
    },
    validate: ['required', 'before', after1900Validator]
  }),
  'family-member-relationship': {
    labelClassName: 'bold',
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 250 }],
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  'has-family-member-been-evacuated': {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'bold'
    }
  },
  memberNumber: {
    className: 'visuallyhidden',
    labelClassName: 'visuallyhidden'
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
  },
  'legal-representative-email': {
    mixin: 'input-text',
    validate: ['email', 'required'],
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    dependent: {
      field: 'is-legal-representative-email',
      value: 'no'
    }
  }
};
