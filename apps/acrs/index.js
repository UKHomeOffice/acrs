'use strict';

const SummaryPageBehaviour = require('hof').components.summary;
const CheckInformationGivenBehaviour = require('./behaviours/continue-report');
const ResumeSession = require('./behaviours/resume-form-session');
const CheckEmailToken = require('./behaviours/check-email-token');
const SaveFormSession = require('./behaviours/save-form-session');

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
      behaviours: [SummaryPageBehaviour, CheckInformationGivenBehaviour],
      sections: require('./sections/summary-data-sections'),
      backLink: false,
      journeyStart: '/who-completing-form'
    },
    '/who-completing-form': {
      behaviours: SaveFormSession,
      forks: [
        {
          target: '/full-name',
          condition: {
            field: 'who-completing-form',
            value: 'the-referrer'
          }
        },
        {
          target: '/helper-details',
          condition: {
            field: 'who-completing-form',
            value: 'someone-helping'
          }
        },
        {
          target: '/immigration-adviser-details',
          condition: {
            field: 'who-completing-form',
            value: 'immigration-advisor'
          }
        }
      ],
      fields: ['who-completing-form'],
      locals: { showSaveAndExit: true },
      next: '/helper-details'
    },
    '/helper-details': {
      fields: [],
      next: '/complete-as-referrer'
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
      fields: ['full-name'],
      forks: [{
        target: '/parent',
        condition: {
          field: 'full-name',
          value: 'under-18'
        }
      }],
      next: '/confirm-referrer-email'
    },

    '/confirm-referrer-email': {
      fields: ['confirm-referrer-email'],
      forks: [{
        target: '/referrer-email',
        condition: {
          field: 'confirm-referrer-email',
          value: 'no'
        }
      }],
      next: '/provide-telephone-number'
    },

    '/referrer-email': {
      fields: [],
      next: '/provide-telephone-number'
    },
    '/provide-telephone-number': {
      fields: [],
      next: '/your-address'
    },
    '/your-address': {
      fields: [],
      next: '/partner'
    },

    // Figma Section: "Who are you applying to bring to the UK? Sponsor under 18" (who-bringing-parent)

    '/parent': {
      fields: ['parent'],
      forks: [{
        target: '/brother-or-sister',
        condition: {
          field: 'parent',
          value: 'no'
        }
      }],
      next: '/parent-details'
    },

    '/parent-details': {
      fields: [],
      next: '/parent-summary'
    },
    '/parent-summary': {
      fields: [],
      next: '/brother-or-sister'
    },

    '/brother-or-sister': {
      fields: ['brother-or-sister'],
      forks: [{
        target: '/additional-family',
        condition: {
          field: 'brother-or-sister',
          value: 'no'
        }
      }],
      next: '/brother-or-sister-details'
    },

    '/brother-or-sister-details': {
      fields: [],
      next: '/brother-or-sister-summary'
    },
    '/brother-or-sister-summary': {
      fields: [],
      next: '/additional-family'
    },

    // Figma Section: "Who are you applying to bring to the UK? Sponsor over 18" (who-bringing-partner)

    '/partner': {
      fields: ['partner'],
      forks: [{
        target: '/children',
        condition: {
          field: 'partner',
          value: 'no'
        }
      }],
      next: '/partner-details'
    },

    '/partner-details': {
      fields: [],
      next: '/partner-summary'
    },
    '/partner-summary': {
      fields: [],
      next: '/children'
    },

    '/children': {
      fields: ['children'],
      forks: [{
        target: '/additional-family',
        condition: {
          field: 'children',
          value: 'no'
        }
      }],
      next: '/child-details'
    },

    '/child-details': {
      fields: [],
      next: '/children-summary'
    },
    '/children-summary': {
      fields: [],
      next: '/child-details-2'
    },
    '/child-details-2': {
      fields: [],
      next: '/additional-family'
    },

    // Figma Section: "Additional family members" (additional-family)

    '/additional-family': {
      fields: ['additional-family'],
      forks: [{
        target: '/no-family-referred',
        condition: {
          field: 'additional-family',
          value: 'no'
        }
      }],
      next: '/additional-family-details'
    },

    '/additional-family-details': {
      fields: [],
      next: '/additional-family-summary'
    },
    '/additional-family-summary': {
      fields: [],
      next: '/family-in-uk'
    },

    '/no-family-referred': {
      fields: ['no-family-referred'],
      forks: [{
        target: '/parent',
        condition: {
          field: 'full-name',
          value: 'under-18'
        }
      }],
      next: '/partner'
    },

    // Figma Section: "Family members that live in the UK" (family-uk)

    '/family-in-uk': {
      fields: ['family-in-uk'],
      forks: [{
        target: '/upload-evidence',
        condition: {
          field: 'family-in-uk',
          value: 'no'
        }
      }],
      next: '/family-in-uk-details'
    },
    '/family-in-uk-details': {
      fields: [],
      next: '/family-in-uk-summary'
    },
    '/family-in-uk-summary': {
      fields: [],
      next: '/family-in-uk-details-2'
    },
    '/family-in-uk-details-2': {
      fields: [],
      next: '/family-in-uk-details-3'
    },
    '/family-in-uk-details-3': {
      fields: [],
      next: '/upload-evidence'
    },

    // Figma Section: "Upload evidence / check details / submit" (upload-evidence)

    '/upload-evidence': {
      fields: [],
      next: '/evidence-notes'
    },
    '/evidence-notes': {
      fields: [],
      next: '/how-send-decision'
    },

    '/how-send-decision': {
      fields: ['how-send-decision'],
      forks: [{
        target: '/email-decision',
        condition: {
          field: 'how-send-decision',
          value: 'email'
        }
      }],
      next: '/your-postal-address'
    },

    '/email-decision': {
      fields: [],
      next: '/confirm'
    },

    '/your-postal-address': {
      fields: [],
      next: '/confirm'
    },
    '/confirm': {
      behaviours: [SummaryPageBehaviour],
      sections: require('./sections/summary-data-sections'),
      next: '/declaration'
    },
    '/declaration': {
      fields: [],
      next: '/referral-submitted'
    },
    '/referral-submitted': {
      fields: [],
      next: '/confirmation'
    },
    '/confirmation': {
      clearSession: true
    },

    // Out of Step Pages

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
    }
  }
};
