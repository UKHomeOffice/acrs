const moment = require('moment');
module.exports = superclass => class extends superclass {
  configure(req, res, next) {
    if(req.sessionModel.get('referred-parents') && !req.sessionModel.get('referred-parents').aggregatedValues.length) {
      req.form.options.addStep = 'parent';
    }
    super.configure(req, res, next);
  }

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
