'use strict';

const _ = require('lodash');

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    // set change link for looping summary fields
    if (locals.route === 'information-you-have-given-us' || locals.route === 'confirm') {
      _.forEach(locals.rows, fields => {
        locals.rows = locals.rows.map(row => {
          // Add new section blocks as aggregator summaries are added
          if (row.section === 'Family in your referral') {
            _.forEach(fields, sectionFields => {
              _.forEach(sectionFields, field => {
                if (field.field === 'parent-full-name') {
                  field.changeLink = '/acrs/parent-summary';
                }
                if (field.field === 'brother-or-sister-full-name') {
                  field.changeLink = '/acrs/brother-or-sister-summary';
                }
                if (field.field === 'child-full-name') {
                  field.changeLink = '/acrs/children-summary';
                }
                if (field.field === 'additional-family-full-name') {
                  field.changeLink = '/acrs/additional-family-summary';
                }
              });
            });
            return row;
          }
          // end section block
          return row;
        });
      });
    }
    return locals;
  }
};
