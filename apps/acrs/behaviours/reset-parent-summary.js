'use strict';

module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    if(req.sessionModel.get('referred-parents') !== undefined) {
      if(req.sessionModel.get('parent') === 'no' &&
      req.sessionModel.get('referred-parents').aggregatedValues.length > 0) {
        req.sessionModel.unset('referred-parents');
      }
    }
    return super.saveValues(req, res, next);
  }
};