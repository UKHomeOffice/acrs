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
    // reset session but keeping login fields, csrf and preexisting cases garnered from API
    this.cleanSession(req);
    // skip requesting data service api when running in local and test mode
    if (config.env === 'local' || config.env === 'test') {
      return super.configure(req, res, next);
    }
    return this.getCases(req, res, next);
  }

  getCases(req, res, next) {
    const email = req.sessionModel.get('user-email');
    const idType = req.sessionModel.get('id-type');

    return axios.get(baseUrl + encodeEmail(email))
      .then(response => {
        const sessionCases = req.sessionModel.get('user-cases') || [];
        const unsubmittedCases = _.filter(response.data, record => !record.submitted_at );
        const parsedBody = this.parseCasesSessions(unsubmittedCases);
        const cases = _.unionBy(parsedBody, sessionCases, 'id');
        const uan = req.sessionModel.get('uan');
        const brp = req.sessionModel.get('brp');
        let isSameCase = '';
        let idNumber = '';

        if (idType === 'brp') {
          isSameCase = _.get(cases, "[0].session['brp']") === brp;
          idNumber = brp;
        }else{
          isSameCase = _.get(cases, "[0].session['uan']") === uan;
          idNumber = uan;
        }


        const singleCase = cases.length < 2;

        const noCaseOrSameCase = !cases[0] || isSameCase;
        const multipleCasesInSession = _.get(req.sessionModel.get('user-cases'), 'length') > 1;

        if (singleCase && noCaseOrSameCase && !multipleCasesInSession) {
          if (cases[0]) {
            this.setupSession(req, cases[0].session);
          }
          req.sessionModel.set('multipleCases', false);
          return res.redirect(super.getNextStep(req, res, next));
        }

        const filteredCases = this.addCasesToSession(req, cases, idNumber);
        this.setupRadioButtons(req, filteredCases);

        return super.configure(req, res, next);
      })
      .catch(next);
  }

  addCasesToSession(req, cases, idNumber) {
    const idType = req.sessionModel.get('id-type');
    const caseAlreadyInSession = cases.find(obj => obj.session[idType] === idNumber);

    if (!caseAlreadyInSession) {
      this.addSessionCaseToList(req, cases);
    }

    const filteredCases = cases.filter(caseType => {
      const isDuplicate = cases.filter(obj => {
        if (idType === 'brp') {
          return obj.session.brp === caseType.session.brp;
        }
        if (idType === 'uan') {
          return obj.session.uan === caseType.session.uan;
        }
      }).length > 1;

      return caseType.id || (!caseType.id && !isDuplicate);
    });

    req.sessionModel.set('user-cases', filteredCases);
    return filteredCases;
  }

  addSessionCaseToList(req, cases) {
    const defaultSession = {
      session: Object.assign(...SESSION_DEFAULTS.fields.map(field => {
        return { [field]: req.sessionModel.get(field) };
      }))
    };
    defaultSession.session.steps = SESSION_DEFAULTS.steps;
    cases.push(defaultSession);
  }

  parseCasesSessions(body) {
    let cases = body;

    if (cases.length) {
      cases = cases.map(caseType => {
        const session = caseType.session;
        caseType.session = typeof session === 'string' ?
          JSON.parse(session) : session;

        return caseType;
      });
    }
    return cases;
  }
  // POST lifecycle
  saveValues(req, res, next) {
    const cases = req.sessionModel.get('user-cases') || [];
    const selectedReferral = req.form.values.referral;
    // Check the selected referral's value against the cases for this user
    const caseObj = cases.find(obj => {
      return obj.session.brp === selectedReferral || obj.session.uan === selectedReferral;
    });

    if (caseObj) {
      req.sessionModel.set('id', caseObj.id);
    }
    this.setupSession(req, caseObj.session);

    req.sessionModel.set('multipleCases', true);

    return super.saveValues(req, res, next);
  }

  setupRadioButtons(req, cases) {
    let dob = '';
    let idNumber = '';
    let idLabel = '';
    let objType = '';

    req.form.options.fields.referral = {
      mixin: 'radio-group',
      isPageHeading: true,
      validate: ['required'],
      options: cases.map(obj => {
        dob = obj.session['date-of-birth'];
        objType = obj.session['id-type'];

        if (objType === 'brp') {
          idNumber = obj.session.brp;
          idLabel = 'Biometric residence permit number:';
        }

        if (objType === 'uan') {
          idNumber = obj.session.uan;
          idLabel = 'Unique Application Number:';
        }

        return {
          label: `${idLabel} ${idNumber}`,
          value: idNumber,
          useHintText: true,
          hint: `Date of birth: ${moment(dob, 'YYYY-MMMM-DD').format('DD MMMM YYYY')}`
        };
      })

    };
  }

  setupSession(req, caseObj) {
    const session = caseObj;

    const signInMethod = req.sessionModel.get('sign-in-method');

    // Don't persist BRP/UAN used to verify if it was not the one originally used for the selected referral
    if (session['id-type'] && session['id-type'] !== signInMethod) {
      delete session[signInMethod];
      req.sessionModel.unset(signInMethod);
    }
    // ensure no /edit steps are add to the steps property when session resumed
    session.steps = session.steps.filter(step => !step.match(/\/change|edit$/));

    delete session['csrf-secret'];
    delete session.errors;

    req.sessionModel.set(session);
  }
};
