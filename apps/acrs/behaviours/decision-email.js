
module.exports = superclass => class extends superclass {
  locals(req, res, next) {
    const superLocals = super.locals(req, res, next);
    const isDecisionEmail = req.form.values['is-decision-by-email'];
    if (isDecisionEmail === 'yes') {
      superLocals.isDecisionEmail = true;
    } else {
      superLocals.isDecisionEmail = false;
    }
    return superLocals;
  }
};
