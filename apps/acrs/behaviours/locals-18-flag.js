const { isOver18 } = require('../../../lib/utilities');

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = Object.assign({}, super.locals(req, res), {
      over18: isOver18(req.sessionModel.get('date-of-birth'))
    });
    return locals;
  }
};
