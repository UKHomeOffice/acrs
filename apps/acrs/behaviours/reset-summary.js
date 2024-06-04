'use strict';

module.exports = (aggregateToField, sectionStartField) => superclass => class extends superclass {
  saveValues(req, res, next) {
    if(req.sessionModel.get(aggregateToField) !== undefined) {
      if(req.sessionModel.get(sectionStartField) === 'no' &&
      req.sessionModel.get(aggregateToField).aggregatedValues.length > 0) {
        req.sessionModel.unset(aggregateToField);
      }
    }
    return super.saveValues(req, res, next);
  }
};
