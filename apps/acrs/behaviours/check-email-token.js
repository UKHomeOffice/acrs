'use strict';
const getToken = require('../../../db/get-token');
const config = require('../../../config');
const _ = require('lodash');

const getIdType = brp => !brp ? 'uan' : 'brp';

module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    const token = req.query.token;
    const skipEmail = config.login.skipEmail;
    const skipEmailAuth = token === 'skip' && config.login.allowSkip && skipEmail;
    const validEmailToken = req.sessionModel.get('valid-token') === true;
    const brpId = _.get(req.session['hof-wizard-verify'], 'brp');
    const uanId = _.get(req.session['hof-wizard-verify'], 'uan');

    if (skipEmailAuth) {
      req.sessionModel.set('valid-token', true);
      req.sessionModel.set('user-email', skipEmail);
      req.sessionModel.set('brp', brpId);
      req.sessionModel.set('uan', uanId);
      req.sessionModel.set('id-type', getIdType(brpId));
      req.sessionModel.set('sign-in-method', _.get(req.session['hof-wizard-verify'], 'sign-in-method'));
      req.sessionModel.set('date-of-birth', _.get(req.session['hof-wizard-verify'], 'date-of-birth'));

      return super.saveValues(req, res, next);
    }

    if (validEmailToken) {
      return super.saveValues(req, res, next);
    }
    // returns a Promise
    return getToken.read(token)
      .then(user => {
        if (user.valid) {
          // this is so a user can go back without requesting a new token
          req.sessionModel.set('valid-token', true);
          // store email to send to caseworker later
          req.sessionModel.set('user-email', user.email);
          req.sessionModel.set('uan', user.uan);
          req.sessionModel.set('brp', user.brp);
          req.sessionModel.set('id-type', getIdType(user.brp));
          req.sessionModel.set('sign-in-method', user['sign-in-method']);
          req.sessionModel.set('date-of-birth', user['date-of-birth']);
          return super.saveValues(req, res, next);
        }
        return res.redirect(config.login.invalidTokenPath);
      })
      .catch(err => req.log('info', `Check Token Error: ${err}`));
  }
};
