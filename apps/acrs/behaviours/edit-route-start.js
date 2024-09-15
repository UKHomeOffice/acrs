// This behaviour captures the return from Edit-mode url.
// Edit-mode is entered by clicking a Change link on a summary page and
// signals that routing will return from the changed (edited) page to
// the summary page.
module.exports = superclass => class extends superclass {
  getValues(req, res, next) {
    req.sessionModel.set('edit-return-path', req.originalUrl);
    return super.getValues(req, res, next);
  }

  saveValues(req, res, next) {
    req.sessionModel.unset('edit-return-path');


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

    return super.saveValues(req, res, next);
  }
};
