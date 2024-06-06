'use strict';

const _ = require('lodash');

module.exports = superclass => class extends superclass {
  locals(req, res, next) {
    const superLocals = super.locals(req, res, next);
    // hide and show fields as necessary on family summary page
    _.forEach(superLocals.items, i => {
      i.itemTitle = i.fields[0].value;
    });

    superLocals.items = superLocals.items.map(item => {
      item.fields = item.fields.map(prop => {
        prop.field += '.summary-heading';
        return prop;
      });
      return item;
    });

    return superLocals;
  }
};
