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
        field: '',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/confirm-referrer-email')) {
            return null;
          }
          return req.sessionModel.get('confirm-referrer-email') === 'yes' ?
            `${req.sessionModel.get('user-email')}` :
            `${req.sessionModel.get('referral-email')}`;
        }
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
  }
};
