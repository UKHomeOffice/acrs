'use strict';
const ValidateCaseDetails = require('./behaviours/validate-case-details');
const SendVerificationEmail = require('./behaviours/send-verification-email');
const GetDobFieldHint = require('./behaviours/get-dob-field-hint');

module.exports = {
  name: 'verify',
  baseUrl: '/',
  steps: {
    '/sign-in': {
      fields: ['sign-in-method'],
      forks: [
        {
          target: '/sign-in-uan',
          condition: {
            field: 'sign-in-method',
            value: 'uan'
          }
        }
      ],
      next: '/sign-in-brp'
    },
    '/sign-in-brp': {
      behaviours: [GetDobFieldHint, ValidateCaseDetails],
      fields: ['brp', 'date-of-birth'],
      backLink: 'sign-in',
      next: '/sign-in-email'
    },
    '/incorrect-details-brp': {
      backLink: 'sign-in-brp'
    },
    '/sign-in-uan': {
      behaviours: [GetDobFieldHint, ValidateCaseDetails],
      fields: ['uan', 'date-of-birth'],
      backLink: 'sign-in',
      next: '/sign-in-email'
    },
    '/incorrect-details-uan': {
      backLink: 'sign-in-uan'
    },
    '/sign-in-email': {
      fields: ['user-email'],
      behaviours: [SendVerificationEmail],
      next: '/check-email'
    },
    '/check-email': {
      behaviours: SendVerificationEmail
    },
    '/accessibility': {
      backLink: 'sign-in'
    },
    '/session-timeout': {},
    '/exit': {}
  }
};
