module.exports = superclass => class extends superclass {
  locals(req, res, next) {
    const locals = super.locals(req, res, next);

    if (req.form.values['how-to-send-decision'] === 'post') {
      locals.isPost = true;
    }else {
      locals.isPost = false;
    }


    return locals;
  }
};
