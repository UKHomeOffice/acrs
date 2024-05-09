'use strict';

const Summary = require('hof').components.summary;
const CheckEmailToken = require('./behaviours/check-email-token');
const ResumeSession = require('./behaviours/resume-form-session');
const ContinueReferral = require('./behaviours/continue-referral');

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
      next: '/continue-form'
    },
    '/continue-form': {
      behaviours: [ResumeSession],
      next: '/information-you-have-given-us',
      backLink: false
    },
    '/information-you-have-given-us': {
      behaviours: [ContinueReferral, Summary],
      sections: require('./sections/summary-data-sections'),
      backLink: false,
      locals: { showSaveAndExit: true },
      journeyStart: '/who-is-completing-form',
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
      behaviours: [Summary],
      sections: require('./sections/summary-data-sections'),
      next: '/confirmation'
    },
    '/confirmation': {
      clearSession: true
    }
  }
};
