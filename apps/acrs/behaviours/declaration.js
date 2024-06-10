const Utilities = require('../../../lib/utilities');

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.isChildrenOver18 = Utilities.isOver18(req.sessionModel.get('date-of-birth'));
    return locals;
  }
};
