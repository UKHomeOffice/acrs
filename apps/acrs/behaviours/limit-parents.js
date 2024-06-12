module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.parentCount = '1';
    if(req.sessionModel.get('referred-parents') !== undefined) {
      const referredParents = req.sessionModel.get('referred-parents').aggregatedValues;
      const parentsLimit = referredParents.length >= req.form.options.aggregateLimit;
      const parentCount = referredParents.length + 1;

      if (referredParents && parentsLimit) {
        locals.noMoreParents = true;
      }
      locals.parentCount = parentCount.toString();
    }
    if (req.sessionModel.get('aggregator-edit-id')) {
      locals.parentCount = parseInt(req.sessionModel.get('aggregator-edit-id'), 10) + 1;
      req.sessionModel.unset('aggregator-edit-id');
    }
    return locals;
  }
};
