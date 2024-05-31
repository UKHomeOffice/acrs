'use strict';
module.exports = superclass => class extends superclass {
  locals(req, res, next) {
    const familyMemberArray = req.sessionModel.get('family-member-in-uk').aggregatedValues;
    req.form.values.memberNumber = familyMemberArray.length + 1;
    return super.locals(req, res, next);
  }
};
