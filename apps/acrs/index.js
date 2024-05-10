'use strict';

const SummaryPageBehaviour = require('hof').components.summary;
const SaveFormSession = require('./behaviours/save-form-session');
const CheckEmailToken = require('./behaviours/check-email-token');

module.exports = {
  name: 'acrs',
  params: '/:action?/:id?/:edit?',
  baseUrl: '/acrs',
  pages: {
    '/terms-and-conditions': 'terms',
    '/cookies': 'cookies'
  },
  steps: {
    '/select-form': {
      behaviours: [CheckEmailToken],
      next: '/information-you-have-given-us',
      backLink: false
    },
    '/information-you-have-given-us': {
      behaviours: [ContinueReferral, SummaryPageBehaviour],
      sections: require('./sections/summary-data-sections'),
      backLink: false,
      locals: { showSaveAndExit: true },
      journeyStart: '/who-is-completing-form',
    },
    '/who-is-completing-form': {
      behaviours: SaveFormSession,
      forks: [
        {
          target: '/full-name',
          condition: {
            field: 'who-is-completing-form',
            value: 'the-referrer'
          }
        },
        {
          target: '/helper-details',
          condition: {
            field: 'who-is-completing-form',
            value: 'someone-helping'
          }
        },
        {
          target: '/immigration-adviser-details',
          condition: {
            field: 'who-is-completing-form',
            value: 'immigration-advisor'
          }
        }
      ],
      fields: ['who-is-completing-form'],
      locals: { showSaveAndExit: true },
      next: '/helper-details'
    },
    '/helper-details': {
      fields: [],
      next: '/full-name'
    },
    '/immigration-adviser-details': {
      fields: [],
      next: '/complete-as-referrer'
    },
    '/complete-as-referrer': {
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
