const moment = require('moment');
module.exports = superclass => class extends superclass {
  configure(req, res, next) {
    const aggregateTo = req.form.options.aggregateTo; // 'referred-children'
    const aggregate = req.sessionModel.get(aggregateTo);

    // When all family member in uk  are removed redirect to the loop section intro
    if(aggregate && !aggregate.aggregatedValues.length) {
      req.form.options.addStep = 'family-in-uk';
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
