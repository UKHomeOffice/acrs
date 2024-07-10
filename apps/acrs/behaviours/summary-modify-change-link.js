'use strict';
// This behaviour is used to set the "Change" links on Summary pages
const _ = require('lodash');

const remapChangeLinks = (fields, mappings) => {
  _.forEach(fields, field => {
    const mapping = mappings.find(mapping => mapping.field === field.field);
    if (mapping) {
      field.changeLink = mapping.changeLink;
    }
  });
  return fields;
}

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    // set change link for looping summary fields
    if (locals.route === 'information-you-have-given-us' || locals.route === 'confirm') {
      _.forEach(locals.rows, section => {

        // Fixup the "Change" link urls for the aggregate Title fields 
        // so that the link jumps to the aggregate's summary page
        if (section.section === 'Family in your referral') {
          const mappings = [
            { 'field': 'parent-full-name', 'changeLink': '/acrs/parent-summary' },
            { 'field': 'brother-or-sister-full-name', 'changeLink': '/acrs/brother-or-sister-summary' },
            { 'field': 'child-full-name', 'changeLink': '/acrs/children-summary' },
            { 'field': 'additional-family-full-name', 'changeLink': '/acrs/additional-family-summary' },
            { 'field': 'partner-full-name', 'changeLink': '/acrs/partner-summary' },
          ];
          section.fields = remapChangeLinks(section.fields, mappings);
        }
        if (section.section === 'Family that live in the UK') {
          const mappings = [
            { 'field': 'family-in-uk', 'changeLink': '/acrs/family-in-uk' },
            { 'field': 'family-member-fullname', 'changeLink': '/acrs/family-in-uk-summary' },
          ];
          section.fields = remapChangeLinks(section.fields, mappings);
        }
      });
    }
    return locals;
  }
};
