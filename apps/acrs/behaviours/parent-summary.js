const moment = require('moment');
module.exports = superclass => class extends superclass {
  configure(req, res, next) {
    // Allow the aggregator behaviour to redirect to the looping section intro page when all previously added parents are removed
    if(req.sessionModel.get('referred-parents') && !req.sessionModel.get('referred-parents').aggregatedValues.length) {
      req.form.options.addStep = 'parent';
    }
    super.configure(req, res, next);
  }

  /**
  * Manipulate field and value details saved in session when rendering into summary page
  *
  * items.fields contains the aggregated array of field and value pairs
  * items.fields.field is the field name
  * items.fields.value is the field's saved value
  * items.fields.parsed will be preferred as the rendered value if it is truthy for an item
  *
  */
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.items = locals.items.map(item => {
      item.fields = item.fields.map(field => {
        // Process a value to parse and reformat it before render
        if (field.field.includes('date-of-birth')) {
          if (field.value !== undefined) {
            field.parsed = moment(field.value, 'YYYY-MMMM-DD').format('DD MMMM YYYY');
          }
        }
        // Appending a value to the field name here allows us to render text from fields.json instead of the fieldname
        field.field += '.summary-heading';
        return field;
      });
      return item;
    });
    return locals;
  }
};
