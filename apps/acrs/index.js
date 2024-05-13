'use strict';

const SummaryPageBehaviour = require('hof').components.summary;
const ResumeSession = require('./behaviours/resume-form-session');
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
    '/start': {
      behaviours: [CheckEmailToken],
      next: '/select-form'
    },
    '/select-form': {
      behaviours: [ResumeSession],
      next: '/information-you-have-given-us',
      backLink: false
    },
    '/information-you-have-given-us': {
    },
    '/who-is-completing-form': {
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
