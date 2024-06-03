module.exports = superclass => class extends superclass {
  getValues(req, res, next) {
    const referredParents = req.sessionModel.get('referred-parents')?.aggregatedValues || [];
    const parentsLimit = referredParents.length >= 2;
    if (referredParents && parentsLimit && req.form.options.route !== '/parent-summary') {
      return res.redirect('/acrs/parent-summary')
    }
    return super.getValues(req, res, next);
  }

  locals(req, res) {
    const locals = super.locals(req, res);
    locals.parentCount = '1';
    if(req.sessionModel.get('referred-parents') !== undefined) {
      const referredParents = req.sessionModel.get('referred-parents').aggregatedValues;
      const parentsLimit = referredParents.length >= 2;
      const parentCount = referredParents.length + 1;

      if (referredParents && parentsLimit) {
        locals.noMoreParents = true;
      }
      locals.parentCount = parentCount.toString();
    }
    return locals;
  }
};
