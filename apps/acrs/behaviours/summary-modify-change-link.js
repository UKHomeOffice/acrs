'use strict';
// This behaviour is used to set the "Change" links on Summary pages
const _ = require('lodash');

const remapChangeLinks = (fields, mappings) => {
  _.forEach(fields, field => {
    const remap = mappings.find(mapping => mapping.field === field.field);
    if (remap) {
      field.changeLink = remap.changeLink;
    }
  });
  return fields;
};
const remapQuestionLinks = (fields, mappings) => {
  _.forEach(fields, field => {
    if (mappings.includes(field.field)) {
      field.changeLink = field.changeLink.replace('/edit', '');
    }
  });
  return fields;
};

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    // set change link for looping summary fields
    if (locals.route === 'information-you-have-given-us' || locals.route === 'confirm') {
      _.forEach(locals.rows, section => {
        if (section.section === 'Family in your referral') {
          // Fixup the "Change" link urls for the aggregate Title fields
          // so that the link jumps to the aggregate's summary page
          const summaryMappings = [
            { field: 'parent-full-name', changeLink: '/acrs/parent-summary' },
            { field: 'brother-or-sister-full-name', changeLink: '/acrs/brother-or-sister-summary' },
            { field: 'child-full-name', changeLink: '/acrs/children-summary' },
            { field: 'additional-family-full-name', changeLink: '/acrs/additional-family-summary' },
            { field: 'partner-full-name', changeLink: '/acrs/partner-summary' }
          ];
          section.fields = remapChangeLinks(section.fields, summaryMappings);

          // Fixup the "Change" link urls for the aggregate Question fields
          // so that the link jumps to the aggregate's Question page without /edit
          const questionMappings = ['partner', 'children', 'additional-family'];
          section.fields = remapQuestionLinks(section.fields, questionMappings);
        }

        if (section.section === 'Family that live in the UK') {
          const mappings = [
            { field: 'family-in-uk', changeLink: '/acrs/family-in-uk' },
            { field: 'family-member-fullname', changeLink: '/acrs/family-in-uk-summary' }
          ];
          section.fields = remapChangeLinks(section.fields, mappings);
        }
      });
    }
    return locals;
  }
};
