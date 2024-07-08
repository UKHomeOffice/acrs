// This behaviour will redirect the route back to a summary page the set the Edit-mode url.
module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    super.saveValues(req, res, err => {
      if (err) {
        next(err);
      }

      const shouldContinueOnEdit = this.isContinueOnEdit(req.form.options, req.form.values);
      const editReturnPath = req.sessionModel.get('edit-return-path');
      if (!shouldContinueOnEdit && editReturnPath) {
        return res.redirect(editReturnPath);
      }
      return next();
    });
  }

  /**
   * Checks if continueOnEdit is set on the form or on the selected fork
   *
   * @param {Object} formOptions - The form configuration (options), typically matching index.js/steps
   * @param {Object} formValues - The form input values, typically from the request as { field: 'value', ... }
   * @return {boolean} true if the form should continue on edit
   */
  isContinueOnEdit(formOptions, formValues) {
    if (formOptions.continueOnEdit) {
      return true;
    }

    const chosenOption = formOptions.forks?.find(fork => {
      return formValues[fork.condition.field] === fork.condition.value;
    });
    return Boolean(chosenOption && chosenOption.continueOnEdit);
  }
};
