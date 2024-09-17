// This behaviour will redirect the route back to the Summary page that set the Edit-mode url in edit-return-path.
module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    super.saveValues(req, res, err => {
      if (err) {
        next(err);
      }

      const shouldContinueOnEdit = this.isContinueOnEdit(req);
      const editReturnPath = req.sessionModel.get('edit-return-path');

      if(req.sessionModel.get('who-completing-form') === 'the-referrer') {
        req.sessionModel.unset('helper-full-name');
        req.sessionModel.unset('helper-relationship');
        req.sessionModel.unset('helper-organisation');
        req.sessionModel.unset('legal-representative-fullname');
        req.sessionModel.unset('legal-representative-organisation');
        req.sessionModel.unset('legal-representative-house-number');
        req.sessionModel.unset('legal-representative-street');
        req.sessionModel.unset('legal-representative-townOrCity');
        req.sessionModel.unset('legal-representative-county');
        req.sessionModel.unset('legal-representative-postcode');
        req.sessionModel.unset('legal-representative-phone-number');
        req.sessionModel.unset('is-legal-representative-email');
        req.sessionModel.unset('legal-representative-email');
      }
      if ( !shouldContinueOnEdit && editReturnPath) {
        return res.redirect(editReturnPath);
      }
      return next();
    });
  }

  /**
   * Checks if continueOnEdit is set on the form or on the selected fork
   */
  isContinueOnEdit(req) {
    if (req.form.options.continueOnEdit) {
      return true;
    }
    const chosenOption = req.form.options.forks?.find(fork => {
      return fork.condition && this.isForkSelected(fork.condition, req);
    });
    return Boolean(chosenOption && chosenOption.continueOnEdit);
  }

  /*
   * Check if the conditions of the fork are met
  */
  isForkSelected(condition, req) {
    if (typeof condition === 'function') {
      return condition(req);
    }
    return req.form.values[condition.field] === condition.value;
  }
};
