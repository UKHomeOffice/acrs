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
  }
};
