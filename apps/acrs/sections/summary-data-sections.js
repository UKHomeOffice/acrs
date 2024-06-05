'use strict';
const moment = require('moment');
const PRETTY_DATE_FORMAT = 'DD MMMM YYYY';

module.exports = {
  'referral-details': {
    steps: [
      {
        field: 'brp',
        omitChangeLink: true
      },
      {
        field: 'uan',
        omitChangeLink: true
      },
      {
        field: 'date-of-birth',
        parse: date => date && moment(date).format(PRETTY_DATE_FORMAT),
        omitChangeLink: true
      },
      {
        steps: '/who-completing-form',
        field: 'who-completing-form'
      },
      {
        steps: '/full-name',
        field: 'full-name'
      },
      {
        steps: '/confirm-referrer-email',
        field: 'confirm-referrer-email',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/confirm-referrer-email')) {
            return null;
          }
          return req.sessionModel.get('confirm-referrer-email') === 'yes' ?
            `${req.sessionModel.get('user-email')}` :
            `${req.sessionModel.get('referral-email')}`;
        }
      },
      {
        steps: '/your-address',
        field: 'your-address-line-1'
      },
      {
        steps: '/your-address',
        field: 'your-address-line-2'
      },
      {
        steps: '/your-address',
        field: 'your-address-town-or-city'
      },
      {
        steps: '/your-address',
        field: 'your-address-postcode'
      }
    ]
  },
  'immigration-adviser-details': {
    steps: [
      {
        field: 'legal-representative-fullname',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/immigration-adviser-details')) {
            return null;
          }
          return list;
        }
      },
      {
        step: '/immigration-adviser-details',
        field: 'legal-representative-email',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/immigration-adviser-details')) {
            return null;
          }
          return req.sessionModel.get('is-legal-representative-email') === 'yes' ?
            `${req.sessionModel.get('user-email')}` :
            `${req.sessionModel.get('legal-representative-email')}`;
        }
      },
      {
        step: '/immigration-adviser-details',
        field: 'legal-representative-phone-number'
      },
      {
        step: '/immigration-adviser-details',
        field: 'legal-representative-address',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/immigration-adviser-details')) {
            return null;
          }
          return `${req.sessionModel.get('legal-representative-house-number')} \n` +
            `${req.sessionModel.get('legal-representative-street')} \n` +
            `${req.sessionModel.get('legal-representative-townOrCity')}\n` +
            `${req.sessionModel.get('legal-representative-county')}\n` +
            `${req.sessionModel.get('legal-representative-postcode')}`;
        }
      }
    ]
  },
  'helper-details': {
    steps: [
      {
        steps: '/helper-details',
        field: 'helper-full-name'
      },
      {
        steps: '/helper-details',
        field: 'helper-relationship'
      },
      {
        steps: '/helper-details',
        field: 'helper-organisation'
      }
    ]
  },
  'family-in-your-referral': {
    steps: [
      {
        steps: '/parent',
        field: 'parent',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/parent')) {
            return null;
          }
          return req.sessionModel.get('parent') === 'yes' ?
            'Yes' : 'No';
        }
      },
      {
        step: '/parent-summary',
        field: 'referred-parents',
        addElementSeparators: true,
        dependsOn: 'parent',
        parse: obj => {
          if (!obj?.aggregatedValues) { return null; }
          for (const item of obj.aggregatedValues) {
            item.fields.map(field => {
              if (field.field === 'parent-full-name') {
                field.isAggregatorTitle = true;
              }
              field.omitChangeLink = true;
              return field;
            });
          }
          return obj;
        }
      }
    ]
  },
  'partner-details': {
    steps: [
      {
        steps: '/partner-details',
        field: 'partner-full-name'
      },
      {
        steps: '/partner-details',
        field: 'partner-phone-number'
      },
      {
        steps: '/partner-details',
        field: 'partner-email'
      },
      {
        steps: '/partner-details',
        field: 'partner-date-of-birth'
      },
      {
        steps: '/partner-details',
        field: 'partner-country'
      },
      {
        steps: '/partner-details',
        field: 'partner-living-situation'
      },
      {
        steps: '/partner-details',
        field: 'partner-why-without-partner'
      }
    ]
  }
};
