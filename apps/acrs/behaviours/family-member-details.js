'use strict';
module.exports = superclass => class extends superclass {
  locals(req, res, next) {
    const id = req.params.id;
    const familyMemberEditUrl = `${req.baseUrl}/family-in-uk-details/edit/${id}`;
    let familyMemberArray = '';
    const aggregateFamilyValue = req.sessionModel.get('family-member-in-uk');

    if (aggregateFamilyValue) {
      familyMemberArray = aggregateFamilyValue.aggregatedValues;
    }
    (familyMemberEditUrl === req._parsedOriginalUrl.pathname) ?
      req.form.values.memberIndex = parseInt(req.params.id, 10) + 1 :
      req.form.values.memberIndex = familyMemberArray.length + 1;

    return super.locals(req, res, next);
  }
};
