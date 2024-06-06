const moment = require('moment');
module.exports = superclass => class extends superclass {
  configure(req, res, next) {
    if(req.sessionModel.get('referred-children') && !req.sessionModel.get('referred-children').aggregatedValues.length) {
      req.form.options.addStep = 'children';
    }
    super.configure(req, res, next);
  }

  /**
   * Iterate the referred Children and fix up data in the fields
   * Date of Birth is formatted to DD MMMM YYYY
   * By appending `.summary-heading` to the `.field` the legend used in the summary is taken from "summary-heading" in fields.json
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The modified local variables.
   */
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.items = locals.items.map(item => {
      item.fields = item.fields.map(field => {
        if (field.field.includes('date-of-birth')) {
          if (field.value !== undefined) {
            field.parsed = moment(field.value, 'YYYY-MMMM-DD').format('DD MMMM YYYY');
          }
        }
        field.field += '.summary-heading';
        return field;
      });
      return item;
    });
    return locals;
  }
};
