/* eslint-disable consistent-return */
'use strict';

const axios = require('axios');
const config = require('../../../config');
const moment = require('moment');
const baseUrl = `${config.saveService.host}:${config.saveService.port}/saved_applications/email/`;
const _ = require('lodash');

const encodeEmail = email => Buffer.from(email).toString('hex');

const SESSION_DEFAULTS = config.sessionDefaults;

module.exports = superclass => class extends superclass {
  cleanSession(req) {
    let cleanList = Object.keys(req.sessionModel.attributes);
    const leaveFields = SESSION_DEFAULTS.fields.concat(['csrf-secret', 'user-cases']);
    cleanList = cleanList.filter(item => leaveFields.indexOf(item) === -1);

    req.sessionModel.unset(cleanList);
    req.sessionModel.set('steps', SESSION_DEFAULTS.steps);
  }
  // GET lifecycle
  configure(req, res, next) {
    // reset session but keeping login fields, csrf and preexisting referrals garnered from API
    this.cleanSession(req);
    // skip requesting data service api when running in local and test mode
    if (config.env === 'local' || config.env === 'test') {
      return super.configure(req, res, next);
    }

    return this.getReferrals(req, res, next);
  }

  getReferrals(req, res, next) {
    const email = req.sessionModel.get('user-email');
    return axios.get(baseUrl + encodeEmail(email))
      .then(response => {
        const referrals = response.data;

        const isSingleCase = referrals.length < 2;

        if (isSingleCase) {
          this.setupSession(req, referrals[0]);
          req.sessionModel.set('multipleReferrals', false);
          return res.redirect(super.getNextStep(req, res, next));
        }

        req.sessionModel.set('user-referrals', referrals);

        const unsubmittedReferrals = referrals.filter(referral => !referral.submitted_at);
        this.setupRadioButtons(req, unsubmittedReferrals);

        return super.configure(req, res, next);
      })
      .catch(next);
  }

  // POST lifecycle
  saveValues(req, res, next) {
    const referrals = req.sessionModel.get('user-referrals');

    const selectedOption = req.form.values['referral'];
    const brpMatch = referrals.find(referral => {
      selectedOption.brp === referral.brp
    });
    const uanMatch = referrals.find(referral => {
      selectedOption.uan === referral.uan
    });
    const selectedReferral = brpMatch || uanMatch;

    if (selectedReferral) {
      req.sessionModel.set('id', selectedReferral.id);
    };

    this.setupSession(req, selectedReferral);
    req.sessionModel.set('multipleReferrals', true);

    return super.saveValues(req, res, next);
  }

  createLabel(req, brp, uan) {
    loginMethod = req.sessionModel.get('login-method')
    return loginMethod === 'brp' ?
      `Biometric residence permit number: ${brp}` :
      `Unique application number: ${uan}`;
  }

  setupRadioButtons(req, referrals) {
    req.form.options.fields.referral = {
      mixin: 'radio-group',
      isPageHeading: true,
      validate: ['required'],
      options: referrals.map(referral => {
        const dob = referral['date-of-birth'];
        return {
          label: `CEPR: ${cepr}`,
          value: referral[req.sessionModel.get('login-method')],
          useHintText: true,
          hint: `Date of birth ${moment(dob, 'YYYY-MM-DD').format('DD MMMM YYYY')}`
        };
      })
    };
  }

  setupSession(req, referral) {
    let session;

    try {
      session = JSON.parse(referral?.session) ?? {};
    } catch(e) {
      session = referral?.session ?? {};
    }
    // do not overwrite session if session in the DB is empty, i.e. new case
    if (_.isEmpty(session)) {
      return;
    }

    // ensure no /edit steps are add to the steps property when session resumed
    session.steps = session.steps.filter(step => !step.match(/\/change|edit$/));

    delete session['csrf-secret'];
    delete session.errors;

    req.sessionModel.set(session);
  }
};
