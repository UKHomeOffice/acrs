'use strict';

const SummaryPageBehaviour = require('hof').components.summary;
const CheckInformationGivenBehaviour = require('./behaviours/continue-report');
const ResumeSession = require('./behaviours/resume-form-session');
const CheckEmailToken = require('./behaviours/check-email-token');
const SaveFormSession = require('./behaviours/save-form-session');
const SaveAndExit = require('./behaviours/save-and-exit');
const Utilities = require('../../lib/utilities');

const Submit = require('./behaviours/submit');
const FamilyMemberBahaviour = require('./behaviours/family-member');
const FamilyDetailBahaviour = require('./behaviours/get-family-detail');
const AggregateSaveUpdate = require('./behaviours/aggregator-save-update');
const FamilyInUkLocalsBehaviour = require('./behaviours/family-in-uk-locals');
const Locals18Flag = require('./behaviours/locals-18-flag');
const AggregateSaveUpdate = require('./behaviours/aggregator-save-update');
const AggregatorSaveUpdate = AggregateSaveUpdate;
const ResetSummary = require('./behaviours/reset-summary');
const ModifySummaryChangeLinks = require('./behaviours/summary-modify-change-link');
const ParentSummary = require('./behaviours/parent-summary');
const LimitParents = require('./behaviours/limit-parents');
const BrotherSisterSummary = require('./behaviours/brother-sister-summary');
const LimitBrothersOrSisters = require('./behaviours/limit-brother-sister');
const ChildrenSummary = require('./behaviours/children-summary');
const LimitChildren = require('./behaviours/limit-children');


// Aggregator section limits
const PARENT_LIMIT = 2;
const BROTHER_OR_SISTER_LIMIT = 100;
const CHILDREN_LIMIT = process.env.NODE_ENV === 'development' ? 2 : 100;


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
      behaviours: [ResumeSession, SaveFormSession],
      next: '/information-you-have-given-us',
      backLink: false
    },
    '/information-you-have-given-us': {
      behaviours: [SummaryPageBehaviour, CheckInformationGivenBehaviour, ModifySummaryChangeLinks],
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
      behaviours: SaveFormSession,
      fields: ['helper-full-name', 'helper-relationship', 'helper-organisation'],
      locals: { showSaveAndExit: true },
      next: '/complete-as-referrer'
    },
    '/immigration-adviser-details': {
      behaviours: SaveFormSession,
      fields: [
        'legal-representative-fullname',
        'legal-representative-organisation',
        'legal-representative-house-number',
        'legal-representative-street',
        'legal-representative-townOrCity',
        'legal-representative-county',
        'legal-representative-postcode',
        'legal-representative-phone-number',
        'is-legal-representative-email',
        'legal-representative-email'
      ],
      continueOnEdit: true,
      locals: { showSaveAndExit: true },
      next: '/complete-as-referrer'
    },
    '/complete-as-referrer': {
      behaviours: SaveFormSession,
      next: '/full-name',
      locals: { showSaveAndExit: true }
    },
    '/full-name': {
      fields: ['full-name'],
      forks: [{
        target: '/parent',
        condition: req => {
          return ! Utilities.isOver18(req.sessionModel.get('date-of-birth'));
        }
      }],
      next: '/confirm-referrer-email',
      behaviours: SaveFormSession,
      locals: { showSaveAndExit: true }
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
      next: '/provide-telephone-number',
      behaviours: SaveFormSession,
      locals: { showSaveAndExit: true }
    },

    '/referrer-email': {
      fields: [
        'referrer-email-options',
        'referrer-email-address'
      ],
      behaviours: SaveFormSession,
      locals: { showSaveAndExit: true },
      next: '/provide-telephone-number'
    },
    '/provide-telephone-number': {
      fields: [
        'provide-telephone-number-options',
        'provide-telephone-number-number'
      ],
      next: '/your-address'
    },
    '/your-address': {
      behaviours: SaveFormSession,
      fields: [
        'your-address-line-1',
        'your-address-line-2',
        'your-address-town-or-city',
        'your-address-postcode'
      ],
      next: '/partner',
      locals: { showSaveAndExit: true }
    },

    // Figma Section: "Who are you applying to bring to the UK? Sponsor under 18" (who-bringing-parent)

    '/parent': {
      behaviours: [ResetSummary('referred-parents', 'parent'), SaveFormSession],
      fields: ['parent'],
      forks: [
        {
          target: '/parent-summary',
          condition: {
            field: 'parent',
            value: 'yes'
          }
        },
        {
          target: '/brother-or-sister',
          condition: {
            field: 'parent',
            value: 'no'
          }
        },
        {
          target: '/parent-details',
          condition: req => {
            if (
              req.form.values.parent === 'yes' &&
                req.sessionModel.get('referred-parents') &&
                req.sessionModel.get('referred-parents').aggregatedValues.length === 0
            ) {
              return true;
            }
            return false;
          }
        }
      ],
      locals: { showSaveAndExit: true },
      continueOnEdit: true
    },
    '/parent-details': {
      behaviours: [LimitParents, SaveFormSession],
      fields: [
        'parent-full-name',
        'parent-phone-number',
        'parent-email',
        'parent-date-of-birth',
        'parent-country',
        'parent-evacuated-without-reason'
      ],
      next: '/parent-summary',
      locals: { showSaveAndExit: true },
      continueOnEdit: true
    },
    '/parent-summary': {
      behaviours: [AggregateSaveUpdate, ParentSummary, LimitParents, SaveFormSession],
      aggregateTo: 'referred-parents',
      aggregateFrom: [
        'parent-full-name',
        'parent-phone-number',
        'parent-email',
        'parent-date-of-birth',
        'parent-country',
        'parent-evacuated-without-reason'
      ],
      titleField: 'parent-full-name',
      addStep: 'parent-details',
      addAnotherLinkText: 'parent',
      locals: { showSaveAndExit: true },
      continueOnEdit: false,
      template: 'parent-summary',
      backLink: 'parent',
      aggregateLimit: PARENT_LIMIT,
      next: '/brother-or-sister'
    },

    '/brother-or-sister': {
      behaviours: [ResetSummary('referred-siblings', 'brother-or-sister'), SaveFormSession],
      fields: ['brother-or-sister'],
      forks: [
        {
          target: '/brother-or-sister-summary',
          condition: {
            field: 'brother-or-sister',
            value: 'yes'
          }
        },
        {
          target: '/additional-family',
          condition: {
            field: 'brother-or-sister',
            value: 'no'
          }
        },
        {
          target: '/brother-or-sister-details',
          condition: req => {
            if (
              req.form.values['brother-or-sister'] === 'yes' &&
                req.sessionModel.get('referred-siblings') &&
                req.sessionModel.get('referred-siblings').aggregatedValues.length === 0
            ) {
              return true;
            }
            return false;
          }
        }
      ],
      locals: { showSaveAndExit: true },
      continueOnEdit: true
    },

    '/brother-or-sister-details': {
      behaviours: [LimitBrothersOrSisters, SaveFormSession],
      fields: [
        'brother-or-sister-full-name',
        'brother-or-sister-date-of-birth',
        'brother-or-sister-country',
        'brother-or-sister-evacuated-without-reason'
      ],
      next: '/brother-or-sister-summary',
      locals: { showSaveAndExit: true },
      continueOnEdit: true
    },
    '/brother-or-sister-summary': {
      behaviours: [AggregateSaveUpdate, BrotherSisterSummary, LimitBrothersOrSisters, SaveFormSession],
      aggregateTo: 'referred-siblings',
      aggregateFrom: [
        'brother-or-sister-full-name',
        'brother-or-sister-date-of-birth',
        'brother-or-sister-country',
        'brother-or-sister-evacuated-without-reason'
      ],
      titleField: 'brother-or-sister-full-name',
      addStep: 'brother-or-sister-details',
      addAnotherLinkText: 'brother or sister',
      locals: { showSaveAndExit: true },
      continueOnEdit: false,
      template: 'brother-or-sister-summary',
      backLink: 'brother-or-sister',
      aggregateLimit: BROTHER_OR_SISTER_LIMIT,
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
      behaviours: SaveFormSession,
      locals: { showSaveAndExit: true },
      next: '/partner-details',
      continueOnEdit: true
    },

    '/partner-details': {
      fields: [
        'partner-full-name',
        'partner-phone-number',
        'partner-email',
        'partner-date-of-birth',
        'partner-country',
        'partner-living-situation',
        'partner-why-without-partner'
      ],
      behaviours: SaveFormSession,
      locals: { showSaveAndExit: true },
      next: '/partner-summary'
    },
    '/partner-summary': {
      fields: [],
      next: '/children'
    },
    '/children': {
      behaviours: [ResetSummary('referred-children', 'children'), SaveFormSession],
      fields: ['children'],
      forks: [
        {
          target: '/children-summary',
          condition: {
            field: 'children',
            value: 'yes'
          }
        },
        {
          target: '/additional-family',
          condition: {
            field: 'children',
            value: 'no'
          }
        },
        {
          target: '/child-details',
          condition: req => {
            if (
              req.form.values.children === 'yes' &&
              req.sessionModel.get('referred-children') &&
              req.sessionModel.get('referred-children').aggregatedValues.length === 0
            ) {
              return true;
            }
            return false;
          }
        }
      ],
      locals: { showSaveAndExit: true },
      continueOnEdit: true
    },
    '/child-details': {
      fields: [
        'child-full-name',
        'child-date-of-birth',
        'child-country',
        'child-living-situation',
        'child-why-without-child'
      ],
      behaviours: SaveFormSession,
      locals: { showSaveAndExit: true },
      next: '/children-summary'
    },
    '/children-summary': {
      behaviours: [
        AggregatorSaveUpdate,
        ChildrenSummary,
        LimitChildren,
        SaveFormSession
      ],
      aggregateTo: 'referred-children',
      aggregateFrom: [
        'child-full-name',
        'child-date-of-birth',
        'child-country',
        'child-living-situation',
        'child-why-without-child'
      ],
      aggregateLimit: CHILDREN_LIMIT,
      titleField: 'child-full-name',
      addStep: 'child-details',
      addAnotherLinkText: 'child',
      locals: {
        showSaveAndExit: true,
        referredChildrenLimit: CHILDREN_LIMIT
      },
      continueOnEdit: false,
      template: 'children-summary',
      backLink: 'children',
      next: '/additional-family'
    },

    // Figma Section: "Additional family members" (additional-family)

    '/additional-family': {
      behaviours: [SaveFormSession, Locals18Flag],
      fields: ['additional-family'],
      forks: [
        {
          target: '/no-family-referred',
          condition: req => {
            if (Utilities.isOver18(req.sessionModel.get('date-of-birth'))) {
              return (req.sessionModel.get('partner') === 'no' &&
                req.sessionModel.get('children') === 'no' &&
                req.sessionModel.get('additional-family') === 'no');
            }
            return (req.sessionModel.get('parent') === 'no' &&
              req.sessionModel.get('brother-or-sister') === 'no' &&
              req.sessionModel.get('additional-family') === 'no');
          }
        },
        {
          target: '/additional-family-details',
          condition: {
            field: 'additional-family',
            value: 'yes'
          }
        }
      ],
      next: '/family-in-uk',
      locals: { showSaveAndExit: true },
      continueOnEdit: true
    },

    '/additional-family-details': {
      fields: [
        'additional-family-full-name',
        'additional-family-date-of-birth',
        'additional-family-relationship',
        'additional-family-country',
        'additional-family-living-situation',
        'additional-family-needs-support',
        'additional-family-why-evac-without',
        'additional-family-why-referring'
      ],
      behaviours: SaveFormSession,
      locals: { showSaveAndExit: true },
      next: '/additional-family-summary'
    },
    '/additional-family-summary': {
      fields: [],
      next: '/family-in-uk'
    },
    '/no-family-referred': {
      behaviours: Locals18Flag
    },
    '/family-in-uk': {
      behaviours: [SaveFormSession, FamilyMemberBahaviour],
      forks: [
        {
          target: '/family-in-uk-details',
          condition: {
            field: 'has-family-in-uk',
            value: 'yes'
          }
        },
        {
          target: '/upload-evidence',
          condition: {
            field: 'has-family-in-uk',
            value: 'no'
          }
        }
      ],
      fields: ['has-family-in-uk'],
      locals: { showSaveAndExit: true },
      next: '/family-in-uk-details'
    },
    '/family-in-uk-details': {
      behaviours: [SaveFormSession, FamilyDetailBahaviour],
      fields: [
        'family-member-fullname',
        'family-member-date-of-birth',
        'family-member-relationship',
        'has-family-member-been-evacuated'
      ],
      backLink: 'family-in-uk',
      next: '/family-in-uk-summary',
      locals: { showSaveAndExit: true },
      titleField: 'countryAddNumber'
    },
    '/family-in-uk-summary': {
      behaviours: [AggregateSaveUpdate, FamilyInUkLocalsBehaviour, SaveFormSession],
      aggregateTo: 'family-member-in-uk',
      aggregateFrom: [
        'family-member-fullname',
        'family-member-relationship',
        'family-member-date-of-birth',
        'has-family-member-been-evacuated',
        'memberIndex'
      ],
      titleField: 'memberIndex',
      addStep: 'family-in-uk-details',
      addAnotherLinkText: 'family member',
      template: 'family-in-uk-summary',
      locals: { showSaveAndExit: true },
      continueOnEdit: true,
      next: '/upload-evidence'
    },
    '/upload-evidence': {
      fields: [],
      next: '/evidence-notes'
    },
    '/evidence-notes': {
      fields: [],
      next: '/how-send-decision'
    },
    '/how-send-decision': {
      fields: ['how-to-send-decision'],
      forks: [{
        target: '/email-decision',
        condition: {
          field: 'how-to-send-decision',
          value: 'email'
        }
      }],
      next: '/decision-postal-address'
    },
    '/email-decision': {
      behaviours: SaveFormSession,
      fields: ['is-decision-by-email', 'is-decision-by-email-detail'],
      locals: { showSaveAndExit: true },
      next: '/confirm'
    },
    '/decision-postal-address': {
      fields: [
        'is-decision-post-address-1',
        'is-decision-post-address-2',
        'is-decision-post-town-or-city',
        'is-decision-post-postcode'
      ],
      locals: { showSaveAndExit: true },
      next: '/confirm'
    },
    '/confirm': {
      behaviours: [SummaryPageBehaviour, ModifySummaryChangeLinks, Submit],
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
      behaviours: SaveAndExit,
      backLink: false
    }
  }
};
