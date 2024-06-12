const Utilities = require('../../../lib/utilities');

const CheckUnder18InAggregatedValue = (aggregateArray, fieldLabel) => {
  const aggregatedLength = aggregateArray.length;

  if (aggregatedLength > 0 &&
     Array.isArray(aggregateArray)) {
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
  }
  return false;
};

const CheckAggregatedValueExist = aggregateArray => {
  if (aggregateArray) {
    if (aggregateArray.hasOwnProperty('aggregatedValues')) {
      return aggregateArray.aggregatedValues;
    }
  }
  return '';
};
module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);

    const refferedSiblings = CheckAggregatedValueExist(req.sessionModel.get('referred-siblings'));
    const refferedChildren = CheckAggregatedValueExist(req.sessionModel.get('referred-children'));
    const refferedAddFamily = CheckAggregatedValueExist(req.sessionModel.get('referred-additional-family'));

    const isAddFamilyUnder18 = CheckUnder18InAggregatedValue(refferedAddFamily, 'additional-family-date-of-birth');
    const isSiblingUnder18 = CheckUnder18InAggregatedValue(refferedSiblings, 'brother-or-sister-date-of-birth');
    const isChildUnder18 = CheckUnder18InAggregatedValue(refferedChildren, 'child-date-of-birth');

    const conditionsArray = [
      isAddFamilyUnder18,
      isChildUnder18,
      isSiblingUnder18
    ];

    if (conditionsArray.includes(true)) {
      locals.isChildrenOver18 = false;
    }else{
      locals.isChildrenOver18 = true;
    }

    return locals;
  }
};
