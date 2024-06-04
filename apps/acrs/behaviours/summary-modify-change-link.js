'use strict';

const _ = require('lodash');

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    // set change link for for looping summary fields
    if (locals.route === 'information-you-have-given-us' || locals.route === 'confirm') {
      _.forEach(locals.rows, fields => {
        locals.rows = locals.rows.map(row => {
          if (row.section === 'Family in your referral') {
            _.forEach(fields, sectionFields => {
              _.forEach(sectionFields, field => {
                if (field.field === 'referred-parents') {
                  field.changeLink = '/acrs/parent-summary';
                }
              });
            });
            return row;
          }
          return row;
        });
      });
    }
    return locals;
  }
};
