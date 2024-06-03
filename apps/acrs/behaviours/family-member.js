'use strict';
module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    const localItem = {
      aggregatedValues: []
    };
    req.sessionModel.set('family-member-in-uk', localItem);
    return super.saveValues(req, res, next);
  }
};
