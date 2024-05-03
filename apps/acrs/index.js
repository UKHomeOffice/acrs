'use strict';

const SummaryPageBehaviour = require('hof').components.summary;

module.exports = {
  name: 'acrs',
  params: '/:action?/:id?/:edit?',
  baseUrl: '/acrs',
  pages: {
    '/terms-and-conditions': 'terms',
    '/cookies': 'cookies'
  },
  steps: {
    '/sign-in': {
      fields: ['sign-in-choice'],
      forks: [{
        target: '/sign-in-brp',
        condition: {
          field: 'sign-in-choice',
          value: 'brp'
        }
      }],
      next: '/sign-in-uan'
    },
    'sign-in-brp': {
      fields: [],
      next: '/sign-in-email'
    },
    '/sign-in-uan': {
      fields: [],
      next: '/sign-in-email'
    },
    '/sign-in-email': {
      fields: [],
      next: '/check-email'
    },
    '/check-email': {
      fields: [],
      next: '/select-form'
    },
    '/select-form': {
      fields: [],
      next: '/who-is-completing-form'
    },
    '/information-you-have-given-us': {
      fields: [],
      next: '/who-is-completing-form'
    },
    '/who-is-completing-form': {
      fields: [],
      next: '/full-name'
    },
    '/full-name': {
      fields: [],
      next: '/confirm'
    },
    '/session-expired': {
      fields: [],
      next: '/confirm'
    },
    '/link-expired': {
      fields: [],
      next: '/confirm'
    },
    '/information-saved': {
      fields: [],
      next: '/confirm'
    },
    '/confirm': {
      behaviours: [SummaryPageBehaviour],
      sections: require('./sections/summary-data-sections'),
      next: '/confirmation'
    },
    '/confirmation': {
      clearSession: true
    }
  }
};
