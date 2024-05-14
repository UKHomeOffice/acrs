module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    if (req.form.options.route === '/sign-in-brp') {
      req.form.values['brp-hint'] = 'This must match what is on your BRP card. ';
    }
    return locals;
  }
};
