const config = require('../../../config');

module.exports = superclass => class extends superclass {
  /*
   * Merges all key-value pairs from the `config.locals` object into
   * the locals available to the view
   */
  locals(req, res) {
    const locals = Object.assign({}, super.locals(req, res), config.locals);

    return locals;
  }
};
