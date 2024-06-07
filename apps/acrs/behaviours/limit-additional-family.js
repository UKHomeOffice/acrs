module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.additionalFamilyCount = '1';
    if(req.sessionModel.get('referred-additional-family') !== undefined) {
      const referredAdditionalFamily = req.sessionModel.get('referred-additional-family').aggregatedValues;
      const additionalFamilyLimit = referredAdditionalFamily.length >= req.form.options.aggregateLimit;
      const referredAdditionalFamilyCount = referredAdditionalFamily.length + 1;

      if (referredAdditionalFamily && additionalFamilyLimit) {
        locals.noMoreAdditionalFamily = true;
      }
      locals.referredAdditionalFamilyCount = referredAdditionalFamilyCount.toString();
    }
    if (req.sessionModel.get('aggregator-edit-id')) {
      locals.additionalFamilyCount = parseInt(req.sessionModel.get('aggregator-edit-id'), 10) + 1;
      req.sessionModel.unset('aggregator-edit-id');
    }
    return locals;
  }
};
