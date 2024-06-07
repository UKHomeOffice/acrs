module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.siblingCount = '1';
    if(req.sessionModel.get('referred-siblings') !== undefined) {
      const referredSiblings = req.sessionModel.get('referred-siblings').aggregatedValues;
      const siblingsLimit = referredSiblings.length >= req.form.options.aggregateLimit;
      const siblingCount = referredSiblings.length + 1;

      if (referredSiblings && siblingsLimit) {
        locals.noMoreSiblings = true;
      }
      locals.siblingCount = siblingCount.toString();
    }
    if (req.sessionModel.get('aggregator-edit-id')) {
      locals.parentCount = parseInt(req.sessionModel.get('aggregator-edit-id'), 10) + 1;
      req.sessionModel.unset('aggregator-edit-id');
    }
    return locals;
  }
};
