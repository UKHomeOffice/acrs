const { IsAgeUnderLimit, generateUniqueReference } = require('../../../lib/utilities');
const { dobFormat, AGE_LIMIT } = require('../../../config');
const { refLength, refAllowedChars } = require('../../../config').uniqueReferralRefs;

const CheckUnder18InAggregatedValue = (aggregateArray, fieldLabel, format, ageLimit) => {
  const aggregatedLength = aggregateArray.length;

  if (aggregatedLength > 0 &&
     Array.isArray(aggregateArray)) {
    let responseObject = '';

    for (let i = 0; i < aggregatedLength; i++) {
      responseObject = aggregateArray[i]
        .fields
        .map(v => v)
        .filter(field => field.field === fieldLabel);

      if (IsAgeUnderLimit(responseObject[0].value, format, ageLimit)) {return true;}
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

    const referredSiblings = CheckAggregatedValueExist(req.sessionModel.get('referred-siblings'));
    const referredChildren = CheckAggregatedValueExist(req.sessionModel.get('referred-children'));
    const referredAddFamily = CheckAggregatedValueExist(req.sessionModel.get('referred-additional-family'));

    const isAddFamilyUnder18 = CheckUnder18InAggregatedValue(referredAddFamily,
      'additional-family-date-of-birth',
      dobFormat,
      AGE_LIMIT);
    const isSiblingUnder18 = CheckUnder18InAggregatedValue(referredSiblings,
      'brother-or-sister-date-of-birth',
      dobFormat,
      AGE_LIMIT);
    const isChildUnder18 = CheckUnder18InAggregatedValue(referredChildren,
      'child-date-of-birth',
      dobFormat,
      AGE_LIMIT);

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

  async saveValues(req, res, next) {
    const referralUniqueRef = await generateUniqueReference(refLength, refAllowedChars);
    req.sessionModel.set('submission-reference', referralUniqueRef);
    return super.saveValues(req, res, next);
  }
};
