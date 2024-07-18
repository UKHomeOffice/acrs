'use strict';
// This behaviour removes a Section's aggregated values from the session if the user has
// changed the selection to 'no' in the Section start field.
module.exports = (aggregateToField, sectionStartField) => superclass => class extends superclass {
  saveValues(req, res, next) {
    if(req.sessionModel.get(aggregateToField) !== undefined) {
      // Note that logic here checks the sessionModel not the form.values.
      // `form.values` is the current value of the form just submitted.
      // `sessionModel` holds the values the previous time the form was submitted.
      // Subsequently the aggregation will only be removed from the session
      // when the form was switched to 'no' on the previous post (Save and continue).
      if(req.sessionModel.get(sectionStartField) === 'no' &&
      req.sessionModel.get(aggregateToField).aggregatedValues.length > 0) {
        req.sessionModel.unset(aggregateToField);
      }
    }
    return super.saveValues(req, res, next);
  }
};
