'use strict';

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
