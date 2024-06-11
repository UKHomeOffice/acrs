const Utilities = require('../../../lib/utilities');

const CheckUnder18InAggregatedValue = (aggregateArray, fieldLabel) => {
  const aggregatedLength = aggregateArray.length;

  let responseObject = '';
  for (let i = 0; i < aggregatedLength; i++) {
    responseObject = aggregateArray[i]
      .fields
      .map(v => v)
      .filter(field => field.field === fieldLabel);

    if (!Utilities.isOver18(responseObject[0].value)) {
      return true;
    }
  }
  return false;
};
module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);

    const familyMember = req.sessionModel.get('family-member-in-uk').aggregatedValues;
    // const refferedSiblings = req.sessionModel.get('referred-siblings').aggregatedValues;
    const refferedChildren = req.sessionModel.get('referred-children').aggregatedValues;
    const refferedAddFamily = req.sessionModel.get('referred-additional-family').aggregatedValues;


    const isAddFamilyUnder18 = CheckUnder18InAggregatedValue(refferedAddFamily, 'additional-family-date-of-birth');
    // const isSiblingUnder18 = CheckOver18InAggregatedValue(refferedSiblings, 'brother-or-sister-date-of-birth');
    const isChildUnder18 = CheckUnder18InAggregatedValue(refferedChildren, 'child-date-of-birth');
    const isFamilyMemberUnder18 = CheckUnder18InAggregatedValue(familyMember, 'family-member-date-of-birth');
    const conditionsArray = [
      isAddFamilyUnder18,
      isChildUnder18,
      isFamilyMemberUnder18
      // isSiblingUnder18
    ];

    if (conditionsArray.includes(true)) {
      locals.isChildrenOver18 = false;
    }else{
      locals.isChildrenOver18 = true;
    }

    return locals;
  }
};
