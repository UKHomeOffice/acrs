/**
 * Exit to Sign-in behaviour
 * For pages with an "Exit" button, when clicked the user is redirected to /sign-in page.
 */
module.exports = superclass => class extends superclass {
  getValues(req, res, next) {
    if(req.body.exit) {
      req.sessionModel.reset();
      return res.redirect('/sign-in');
    }

    return next();
  }
};
