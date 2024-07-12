'use strict';
const SummaryPageBehaviour = require('hof').components.summary;
const CheckInformationGivenBehaviour = require('./behaviours/continue-report');
const ResumeSession = require('./behaviours/resume-form-session');
const CheckEmailToken = require('./behaviours/check-email-token');
const SaveFormSession = require('./behaviours/save-form-session');
const SaveImage = require('./behaviours/save-image');
const RemoveImage = require('./behaviours/remove-image');
const LimitDocument = require('./behaviours/limit-documents');
const SaveAndExit = require('./behaviours/save-and-exit');
const Utilities = require('../../lib/utilities');
const Submit = require('./behaviours/submit');
const AggregateSaveUpdate = require('./behaviours/aggregator-save-update');
const Locals18Flag = require('./behaviours/locals-18-flag');
const ResetSummary = require('./behaviours/reset-summary');
const ModifySummaryChangeLinks = require('./behaviours/summary-modify-change-link');
const ParentSummary = require('./behaviours/parent-summary');
const LimitParents = require('./behaviours/limit-parents');
const BrotherSisterSummary = require('./behaviours/brother-sister-summary');
const LimitBrothersOrSisters = require('./behaviours/limit-brother-sister');
const ChildrenSummary = require('./behaviours/children-summary');
const LimitChildren = require('./behaviours/limit-children');
const AdditionalFamilySummary = require('./behaviours/additional-family-summary');
const LimitAdditionalFamily = require('./behaviours/limit-additional-family');
const limitFamilyInUk = require('./behaviours/limit-family-in-uk');
const familyInUkSummary = require('./behaviours/family-in-uk-summary');
const DeclarationBehaviour = require('./behaviours/declaration');
const PartnerSummary = require('./behaviours/partner-summary');
const LimitPartners = require('./behaviours/limit-partners');
const ExitToSignIn = require('./behaviours/exit-to-sign-in');
const EditRouteStart = require('./behaviours/edit-route-start');
const EditRouteReturn = require('./behaviours/edit-route-return');

// Aggregator section limits
const PARENT_LIMIT = 2;
const BROTHER_OR_SISTER_LIMIT = process.env.NODE_ENV === 'development' ? 5 : 100;
const CHILDREN_LIMIT = process.env.NODE_ENV === 'development' ? 2 : 100;
const ADDITIONAL_FAMILY_LIMIT = process.env.NODE_ENV === 'development' ? 5 : 100;
const PARTNER_LIMIT = 1;

/**
 * Is the form value 'yes' and aggregation populated?
 *
 * @param {Object} req - The request god object.
 * @param {string} formValue - The name of the req.form.values field to check is 'yes.
 * @param {string} aggregateName - The name of the req.sessionModel to check has a populated array (== aggregateTo)
 * @return {boolean} Returns true if the form value is 'yes' and  has aggregated values, otherwise false.
 */
const yesPlusAggregation = (req, formValue, aggregateName) => {
  if (
    req.form.values[formValue] === 'yes' &&
    req.sessionModel.get(aggregateName) &&
    req.sessionModel.get(aggregateName).aggregatedValues.length > 0
  ) {
    return true;
  }
  return false;
};

/**
 * Is the form value 'yes' and the aggregation empty?
 *
 * @param {Object} req - The request god object.
 * @param {string} formValue - The name of the form value to check.
 * @param {string} aggregateName - The name of the session model to check. (== aggregateTo)
 * @return {boolean} Returns true if the form value is 'yes' and the aggregation is empty, otherwise false.
 */
const yesEmptyAggregation = (req, formValue, aggregateName) => {
  if (
    req.form.values[formValue] === 'yes' &&
    ( !req.sessionModel.get(aggregateName) ||
      req.sessionModel.get(aggregateName).aggregatedValues.length === 0)
  ) {
    return true;
  }
  return false;
};


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
      behaviours: [ExitToSignIn, ResumeSession, SaveFormSession],
      next: '/information-you-have-given-us',
      backLink: false
    },
    '/information-you-have-given-us': {
      behaviours: [
        ExitToSignIn,
        SummaryPageBehaviour,
        CheckInformationGivenBehaviour,
        ModifySummaryChangeLinks,
        EditRouteStart
      ],
      sections: require('./sections/summary-data-sections'),
      backLink: false,
      journeyStart: '/who-completing-form'
    },
    '/who-completing-form': {
      behaviours: [SaveFormSession, EditRouteReturn],
      forks: [
        {
          target: '/full-name',
          condition: {
            field: 'who-completing-form',
            value: 'the-referrer'
          },
          continueOnEdit: false
        },
        {
          target: '/helper-details',
          continueOnEdit: true,
          condition: {
            field: 'who-completing-form',
            value: 'someone-helping'
          }
        },
        {
          target: '/immigration-adviser-details',
          continueOnEdit: true,
          condition: {
            field: 'who-completing-form',
            value: 'immigration-advisor'
          }
        }
      ],
      fields: ['who-completing-form'],
      locals: { showSaveAndExit: true }
    },
    '/helper-details': {
      behaviours: [SaveFormSession, EditRouteReturn],
      fields: ['helper-full-name', 'helper-relationship', 'helper-organisation'],
      locals: { showSaveAndExit: true },
      next: '/complete-as-referrer'
    },
    '/immigration-adviser-details': {
      behaviours: [SaveFormSession, EditRouteReturn],
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
      locals: { showSaveAndExit: true },
      next: '/complete-as-referrer'
    },
    '/complete-as-referrer': {
      behaviours: [SaveFormSession, EditRouteReturn],
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
      next: '/confirm-your-email',
      behaviours: SaveFormSession,
      locals: { showSaveAndExit: true }
    },
    '/confirm-your-email': {
      fields: ['confirm-your-email'],
      forks: [{
        target: '/your-email',
        condition: {
          field: 'confirm-your-email',
          value: 'no'
        },
        continueOnEdit: true
      }],
      next: '/provide-telephone-number',
      behaviours: [SaveFormSession, EditRouteReturn],
      locals: { showSaveAndExit: true }
    },

    '/your-email': {
      fields: [
        'your-email-options',
        'your-email-address'
      ],
      behaviours: [SaveFormSession, EditRouteReturn],
      locals: { showSaveAndExit: true },
      next: '/provide-telephone-number'
    },
    '/provide-telephone-number': {
      fields: [
        'provide-telephone-number-options',
        'provide-telephone-number-number'
      ],
      behaviours: [SaveFormSession, EditRouteReturn],
      locals: { showSaveAndExit: true },
      next: '/your-address'
    },
    '/your-address': {
      behaviours: [SaveFormSession, EditRouteReturn],
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
      behaviours: [
        ResetSummary('referred-parents', 'parent'),
        SaveFormSession,
        EditRouteReturn
      ],
      fields: ['parent'],
      forks: [
        {
          target: '/parent-summary',
          condition: {
            field: 'parent',
            value: 'yes'
          },
          continueOnEdit: true
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
          condition: req => yesEmptyAggregation(req, 'parent', 'referred-parents'),
          continueOnEdit: true
        }
      ],
      locals: { showSaveAndExit: true }
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
      locals: { showSaveAndExit: true }
    },
    '/parent-summary': {
      behaviours: [
        AggregateSaveUpdate,
        ParentSummary,
        LimitParents,
        SaveFormSession,
        EditRouteReturn
      ],
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
      behaviours: [
        ResetSummary('referred-siblings', 'brother-or-sister'),
        SaveFormSession,
        EditRouteReturn
      ],
      fields: ['brother-or-sister'],
      forks: [
        {
          target: '/brother-or-sister-summary',
          condition: {
            field: 'brother-or-sister',
            value: 'yes'
          },
          continueOnEdit: true
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
          condition: req => yesEmptyAggregation(req, 'brother-or-sister', 'referred-siblings'),
          continueOnEdit: true
        }
      ],
      locals: { showSaveAndExit: true }
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
      locals: { showSaveAndExit: true }
    },
    '/brother-or-sister-summary': {
      behaviours: [
        AggregateSaveUpdate,
        BrotherSisterSummary,
        LimitBrothersOrSisters,
        SaveFormSession,
        EditRouteReturn
      ],
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
      behaviours: [
        ResetSummary('referred-partners', 'partner'),
        SaveFormSession,
        EditRouteReturn
      ],
      fields: ['partner'],
      forks: [
        // partner -> yes -> partner summary (skipping details if already exist)
        {
          target: '/partner-summary',
          condition: req => yesPlusAggregation(req, 'partner', 'referred-partners'),
          continueOnEdit: true
        },
        {
          target: '/partner-details',
          condition: req => yesEmptyAggregation(req, 'partner', 'referred-partners'),
          continueOnEdit: true
        }
      ],
      locals: { showSaveAndExit: true },
      next: '/children'
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
      behaviours: [SaveFormSession, EditRouteReturn],
      continueOnEdit: true,
      locals: { showSaveAndExit: true },
      next: '/partner-summary'
    },
    '/partner-summary': {
      behaviours: [
        AggregateSaveUpdate,
        PartnerSummary,
        LimitPartners,
        SaveFormSession,
        EditRouteReturn
      ],
      aggregateTo: 'referred-partners',
      aggregateFrom: [
        'partner-full-name',
        'partner-phone-number',
        'partner-email',
        'partner-date-of-birth',
        'partner-country',
        'partner-living-situation',
        'partner-why-without-partner'
      ],
      aggregateLimit: PARTNER_LIMIT,
      titleField: 'partner-full-name',
      addStep: 'partner-details',
      addAnotherLinkText: 'partner',
      locals: {
        showSaveAndExit: true,
        referredPartnerLimit: PARTNER_LIMIT
      },
      continueOnEdit: false,
      template: 'partner-summary',
      backLink: 'partner',
      next: '/children'
    },

    '/children': {
      behaviours: [
        ResetSummary('referred-children', 'children'),
        SaveFormSession,
        EditRouteReturn
      ],
      fields: ['children'],
      forks: [
        {
          target: '/children-summary',
          condition: req => yesPlusAggregation(req, 'children', 'referred-children'),
          continueOnEdit: true
        },
        {
          target: '/child-details',
          condition: req => yesEmptyAggregation(req, 'children', 'referred-children'),
          continueOnEdit: true
        }
      ],
      locals: { showSaveAndExit: true },
      next: '/additional-family'
    },
    '/child-details': {
      fields: [
        'child-full-name',
        'child-date-of-birth',
        'child-country',
        'child-living-situation',
        'child-why-without-child'
      ],
      behaviours: [SaveFormSession, EditRouteReturn],
      continueOnEdit: true,
      locals: { showSaveAndExit: true },
      next: '/children-summary'
    },
    '/children-summary': {
      behaviours: [
        AggregateSaveUpdate,
        ChildrenSummary,
        LimitChildren,
        SaveFormSession,
        EditRouteReturn
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
      behaviours: [
        ResetSummary('referred-additional-family', 'additional-family'),
        SaveFormSession,
        Locals18Flag,
        EditRouteReturn
      ],
      fields: ['additional-family'],
      forks: [
        {
          target: '/additional-family-summary',
          condition: req => yesPlusAggregation(req, 'additional-family', 'referred-additional-family'),
          continueOnEdit: true
        },
        {
          target: '/additional-family-details',
          condition: req => yesEmptyAggregation(req, 'additional-family', 'referred-additional-family'),
          continueOnEdit: true
        },
        {
          target: '/no-family-referred',
          // 'no-family-referred' occurs when:
          //  - an >18 has not referred any Partner, Children or Additional Family
          //  - an <18 has not referred any Parent, Brother or Sister or Additional Family
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
        }
      ],
      locals: { showSaveAndExit: true },
      next: '/family-in-uk'
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
      behaviours: [
        LimitAdditionalFamily,
        SaveFormSession,
        EditRouteReturn
      ],
      continueOnEdit: true,
      locals: { showSaveAndExit: true },
      next: '/additional-family-summary'
    },
    '/additional-family-summary': {
      behaviours: [
        AggregateSaveUpdate,
        AdditionalFamilySummary,
        LimitAdditionalFamily,
        SaveFormSession,
        EditRouteReturn
      ],
      aggregateTo: 'referred-additional-family',
      aggregateFrom: [
        'additional-family-full-name',
        'additional-family-date-of-birth',
        'additional-family-relationship',
        'additional-family-country',
        'additional-family-living-situation',
        'additional-family-needs-support',
        'additional-family-why-evac-without',
        'additional-family-why-referring'
      ],
      titleField: 'additional-family-full-name',
      addStep: 'additional-family-details',
      addAnotherLinkText: 'family member',
      locals: { showSaveAndExit: true },
      continueOnEdit: false,
      template: 'additional-family-summary',
      backLink: 'additional-family',
      aggregateLimit: ADDITIONAL_FAMILY_LIMIT,
      next: '/family-in-uk'
    },

    // 'no-family-referred' occurs when the referrer has answered "no" to all the referees questions
    '/no-family-referred': {
      behaviours: Locals18Flag
    },

    '/family-in-uk': {
      behaviours: [
        ResetSummary('uk-family-aggregate', 'has-family-in-uk'),
        SaveFormSession,
        EditRouteReturn
      ],
      fields: ['has-family-in-uk'],
      forks: [
        {
          target: '/family-in-uk-summary',
          condition: req => yesPlusAggregation(req, 'has-family-in-uk', 'uk-family-aggregate'),
          continueOnEdit: true
        },
        {
          target: '/family-in-uk-details',
          condition: req => yesEmptyAggregation(req, 'has-family-in-uk', 'uk-family-aggregate'),
          continueOnEdit: true
        }
      ],
      locals: { showSaveAndExit: true },
      next: '/upload-evidence'
    },
    '/family-in-uk-details': {
      behaviours: [SaveFormSession, limitFamilyInUk, EditRouteReturn],
      fields: [
        'family-member-fullname',
        'family-member-date-of-birth',
        'family-member-relationship',
        'has-family-member-been-evacuated'
      ],
      continueOnEdit: true,
      backLink: 'family-in-uk',
      next: '/family-in-uk-summary',
      locals: { showSaveAndExit: true },
      titleField: 'countryAddNumber'
    },
    '/family-in-uk-summary': {
      behaviours: [
        AggregateSaveUpdate,
        limitFamilyInUk,
        familyInUkSummary,
        SaveFormSession,
        EditRouteReturn
      ],
      aggregateTo: 'uk-family-aggregate',
      aggregateFrom: [
        'family-member-fullname',
        'family-member-relationship',
        'family-member-date-of-birth',
        'has-family-member-been-evacuated'
      ],
      titleField: 'family-member-fullname',
      addStep: 'family-in-uk-details',
      addAnotherLinkText: 'family member',
      template: 'family-in-uk-summary',
      locals: { showSaveAndExit: true },
      aggregateLimit: Utilities.DEFAULT_AGGREGATOR_LIMIT,
      continueOnEdit: false,
      next: '/upload-evidence'
    },

    '/upload-evidence': {
      behaviours: [SaveFormSession, SaveImage('image'), RemoveImage, LimitDocument],
      fields: ['image'],
      locals: { showSaveAndExit: true },
      continueOnEdit: true,
      next: '/evidence-notes'
    },
    '/evidence-notes': {
      behaviours: [SaveFormSession],
      fields: ['evidence-notes-details'],
      continueOnEdit: false,
      next: '/how-send-decision'
    },
    '/how-send-decision': {
      fields: ['how-to-send-decision'],
      forks: [
        {
          target: '/email-decision',
          condition: {
            field: 'how-to-send-decision',
            value: 'email'
          }
        },
        {
          target: '/decision-postal-address',
          condition: {
            field: 'how-to-send-decision',
            value: 'post'
          }
        }
      ],
      next: '',
      locals: { showSaveAndExit: true }
    },
    '/email-decision': {
      behaviours: [SaveFormSession],
      fields: ['is-decision-by-email', 'is-decision-by-email-detail'],
      locals: { showSaveAndExit: true },
      next: '/confirm'
    },
    '/decision-postal-address': {
      behaviours: [SaveFormSession],
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
      behaviours: [
        SummaryPageBehaviour,
        SaveFormSession,
        ModifySummaryChangeLinks,
        EditRouteStart
      ],
      sections: require('./sections/summary-data-sections'),
      locals: { showSaveAndExit: true },
      next: '/declaration'
    },
    '/declaration': {
      fields: ['children-declaration'],
      sections: require('./sections/summary-data-sections'),
      behaviours: [DeclarationBehaviour, SaveFormSession, SummaryPageBehaviour, ModifySummaryChangeLinks, Submit],
      locals: { showSaveAndExit: true },
      next: '/referral-submitted'
    },
    '/referral-submitted': {
      clearSession: true,
      backLink: false
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
