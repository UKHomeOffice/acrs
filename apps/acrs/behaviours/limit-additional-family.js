module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.additionalFamilyCount = '1';
    if(req.sessionModel.get('referred-additional-family') !== undefined) {
      const referredAdditionalFamily = req.sessionModel.get('referred-additional-family').aggregatedValues;
      const additionalFamilyLimit = referredAdditionalFamily.length >= req.form.options.aggregateLimit;
      const referredAdditionalFamilyCount = referredAdditionalFamily.length + 1;

      if (referredAdditionalFamily && additionalFamilyLimit) {
        locals.noMoreSiblings = true;
      }
      locals.referredAdditionalFamilyCount = referredAdditionalFamilyCount.toString();
    }
    return locals;
  }
};
