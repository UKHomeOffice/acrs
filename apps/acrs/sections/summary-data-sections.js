'use strict';
const moment = require('moment');
const PRETTY_DATE_FORMAT = 'DD MMMM YYYY';

const addressFormatter = (model, fieldNames) => {
  const fields = fieldNames.map(fieldName => model.get(fieldName));
  return fields.map(field => field.trim()).filter(field => field).join('\n');
};

/**
 * Parses an Aggregator array to promote the Title field, reformat the DOB and remove the Change link
 *
 * @param {Array} aggregate - The Aggregator
 * @param {string} titleField - The field used as the title for aggregation.
 * @param {string} [dobField='date-of-birth'] - The field representing the date of birth.
 * @return {void} It's all side-effects
 */
const aggregateParser = (aggregate, titleField, dobField = 'date-of-birth') => {
  for (const item of aggregate) {
    item.fields.map(field => {
      // All the fields in the aggregated values have their Change link removed.
      field.omitChangeLink = true;
      if (field.field === titleField) {
        // One field is promoted to Title so that it receives the "Change" link
        field.isAggregatorTitle = true;
      }
      if (field.field.includes(dobField) && field.value !== undefined) {
        field.parsed = moment(field.value).format(PRETTY_DATE_FORMAT);
      }
      return field;
    });
  }
};


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
        steps: '/confirm-your-email',
        // The sessionModel field for the email address associated with /confirm-your-email is 'user-email'
        field: 'confirm-your-email',
        parse: (list, req) => {
          if ( !req.sessionModel.get('steps').includes('/confirm-your-email')) {
            return null;
          }
          return req.sessionModel.get('confirm-your-email') === 'yes' ? 'Yes' : 'No';
        }
      },
      {
        steps: '/your-email',
        field: 'your-email-options',
        parse: (list, req) => {
          if ( !req.sessionModel.get('steps').includes('/your-email')) {
            return null;
          }
          return req.sessionModel.get('your-email-options') === 'yes' ? 'Yes' : 'No';
        }
      },
      {
        steps: '/your-email',
        field: 'your-email-address',
        parse: (list, req) => req.sessionModel.get('steps').includes('/your-email') ?
          req.sessionModel.get('your-email-address') :
          null
      },
      {
        step: '/provide-telephone-number',
        field: 'provide-telephone-number',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/provide-telephone-number')) {
            return null;
          }
          return req.sessionModel.get('provide-telephone-number-options') === 'yes' ?
            `${req.sessionModel.get('provide-telephone-number-number')}` :
            'No';
        }
      },
      {
        steps: '/your-address',
        field: 'your-address-line-1',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/your-address')) {
            return null;
          }
          return addressFormatter(req.sessionModel, [
            'your-address-line-1',
            'your-address-line-2',
            'your-address-town-or-city',
            'your-address-postcode'
          ]);
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
        field: 'legal-representative-organisation'
      },
      {
        step: '/immigration-adviser-details',
        field: 'legal-representative-house-number',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/immigration-adviser-details')) {
            return null;
          }
          return addressFormatter(req.sessionModel, [
            'legal-representative-house-number',
            'legal-representative-street',
            'legal-representative-townOrCity',
            'legal-representative-county',
            'legal-representative-postcode'
          ]);
        }
      },
      {
        step: '/immigration-adviser-details',
        field: 'legal-representative-phone-number'
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
        // "Are you referring a partner to come to the UK?"
        steps: '/partner',
        field: 'partner',
        parse: (list, req) => {
          if ( !req.sessionModel.get('steps').includes('/partner') ) {
            return null;
          }
          return req.sessionModel.get('partner') === 'yes' ? 'Yes' : 'No';
        }
      },
      {
        // "Are you referring your children to come to the UK?"
        step: '/children',
        field: 'children',
        parse: (list, req) => {
          if ( !req.sessionModel.get('steps').includes('/children') ) {
            return null;
          }
          return req.sessionModel.get('children') === 'yes' ? 'Yes' : 'No';
        }
      },
      {
        // Are you referring a parent to come to the UK?
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
        // Are you referring a brother or sister to come to the UK?
        steps: '/brother-or-sister',
        field: 'brother-or-sister',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/brother-or-sister')) {
            return null;
          }
          return req.sessionModel.get('brother-or-sister') === 'yes' ?
            'Yes' : 'No';
        }
      },
      {
        // "Are you referring additional family members to come to the UK?"
        steps: '/additional-family',
        field: 'additional-family',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/additional-family')) {
            return null;
          }
          return req.sessionModel.get('additional-family') === 'yes' ?
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
              if (field.field.includes('date-of-birth')) {
                if (field.value !== undefined) {
                  field.parsed = moment(field.value).format('DD MMMM YYYY');
                }
              }
              return field;
            });
          }
          return obj;
        }
      },
      {
        step: '/brother-or-sister-summary',
        field: 'referred-siblings',
        addElementSeparators: true,
        dependsOn: 'brother-or-sister',
        parse: obj => {
          if (!obj?.aggregatedValues) { return null; }
          for (const item of obj.aggregatedValues) {
            item.fields.map(field => {
              if (field.field === 'brother-or-sister-full-name') {
                field.isAggregatorTitle = true;
              }
              field.omitChangeLink = true;
              if (field.field.includes('date-of-birth')) {
                if (field.value !== undefined) {
                  field.parsed = moment(field.value).format('DD MMMM YYYY');
                }
              }
              return field;
            });
          }
          return obj;
        }
      },
      {
        step: '/partner-summary',
        field: 'referred-partners',
        addElementSeparators: true,
        dependsOn: 'partner',
        parse: obj => {
          if (!obj?.aggregatedValues) { return null; }
          aggregateParser(obj.aggregatedValues, 'partner-full-name');
          return obj;
        }
      },
      {
        step: '/children-summary',
        field: 'referred-children',
        addElementSeparators: true,
        dependsOn: 'children',
        parse: obj => {
          if (!obj?.aggregatedValues) { return null; }
          aggregateParser(obj.aggregatedValues, 'child-full-name');
          return obj;
        }
      },
      {
        step: '/additional-family-summary',
        field: 'referred-additional-family',
        addElementSeparators: true,
        dependsOn: 'additional-family',
        parse: obj => {
          if (!obj?.aggregatedValues) { return null; }
          aggregateParser(obj.aggregatedValues, 'additional-family-full-name');
          return obj;
        }
      }
    ]
  },
  'family-in-uk': {
    steps: [
      {
        // "Do you have family that live in the UK?"
        steps: '/family-in-uk',
        field: 'family-in-uk',
        parse: (list, req) => {
          if (!req.sessionModel.get('steps').includes('/family-in-uk')) {
            return null;
          }
          return req.sessionModel.get('has-family-in-uk') === 'yes' ?
            'Yes' : 'No';
        }
      },
      {
        step: '/family-in-uk-summary',
        field: 'uk-family-aggregate',
        addElementSeparators: true,
        dependsOn: 'has-family-in-uk',
        parse: obj => {
          if (!obj?.aggregatedValues) { return null; }
          aggregateParser(obj.aggregatedValues, 'family-member-fullname', 'family-member-date-of-birth');
          return obj;
        }
      }
    ]
  },
  'evidence-documents': [
    {
      step: '/upload-evidence',
      field: 'images',
      parse: (list, req) => {
        if (!req.sessionModel.get('steps').includes('/upload-evidence')) {
          return null;
        }
        if (req.sessionModel.get('images')) {
          return req.sessionModel.get('images').length > 0 ? list && list.map(i => i.name).join('\n') : 'None uploaded';
        }
        return 'None uploaded';
      }
    }
  ],
  'evidence-notes': [
    {
      step: '/evidence-notes',
      field: 'evidence-notes-details',
      parse: (list, req) => {
        if ( !req.sessionModel.get('steps').includes('/evidence-notes') ||
        req.sessionModel.get('evidence-notes-details') === '') {
          return null;
        }
        return req.sessionModel.get('evidence-notes-details');
      }
    }
  ],
  'how-send-decision': [
    {
      step: '/how-send-decision',
      field: 'how-to-send-decision'
    },
    {
      step: '/email-decision',
      field: 'is-decision-by-email-detail',
      parse: (list, req) => {
        if ( !req.sessionModel.get('steps').includes('/email-decision')) {
          return null;
        }

        return req.sessionModel.get('is-decision-by-email-detail') ||
          req.sessionModel.get('user-email') ||
          'None provided';
      }
    },
    {
      step: '/decision-postal-address',
      field: 'is-decision-post-address-1',
      parse: (list, req) => {
        if (!req.sessionModel.get('steps').includes('/decision-postal-address')) {
          return null;
        }
        return addressFormatter(req.sessionModel, [
          'is-decision-post-address-1',
          'is-decision-post-address-2',
          'is-decision-post-town-or-city',
          'is-decision-post-postcode'
        ]);
      }
    }
  ]
};
