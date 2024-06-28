/* eslint-disable camelcase */

const axios = require('axios');
const config = require('../../../config');
const _ = require('lodash');

const applicationsUrl = `${config.saveService.host}:${config.saveService.port}/saved_applications`;


module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    return super.saveValues(req, res, async err => {
      if (err) {
        return next(err);
      }

      // remove csrf secret and errors from session data to prevent CSRF Secret issues in the session
      const session = req.sessionModel.toJSON();
      delete session['csrf-secret'];
      delete session.errors;
      delete session['valid-token'];
      delete session['user-cases'];

      if (session.steps.indexOf(req.path) === -1) {
        session.steps.push(req.path);
      }
      // ensure no /edit steps are add to the steps property when we save to the store
      session.steps = session.steps.filter(step => !step.match(/\/change|edit$/));

      // skip requesting data service api when running in local and test mode
      if (config.env === 'local' || config.env === 'test') {
        return next();
      }

      const id = req.sessionModel.get('id');
      const email = req.sessionModel.get('user-email');
      const uan = req.sessionModel.get('uan');
      const brp = req.sessionModel.get('brp');
      const date_of_birth = req.sessionModel.get('date-of-birth');

      req.log('info', `Saving Form Session: ${id}`);

      try {
        const response = await axios({
          url: id ? applicationsUrl + `/${id}` : applicationsUrl,
          method: id ? 'PATCH' : 'POST',
          data: id ? { session } : { session, email, brp, uan, date_of_birth }
        });

        const resBody = response.data;

        if (resBody && resBody.length && resBody[0].id) {
          req.sessionModel.set('id', resBody[0].id);
        } else {
          req.sessionModel.unset('id');
        }

        if (req.body['save-and-exit']) {
          return res.redirect('/acrs/information-saved');
        }

        if(req.body.exit) {
          return res.redirect('/sign-in');
        }

        // continueOnEdit can be set on the form or on individual forks
        const isContinueOnEdit = this.isChoiceContinueOnEdit(req.form.options, req.form.values);

        // const isContinueOnEdit = req.form.options.continueOnEdit &&
        // _.get(req.form.options.forks, '[0].continueOnEdit');

        // The assumption here is when there is a fork in the form
        // then its first entry is the only route into a looped section
        const loopedForkCondition = _.get(req.form.options.forks, '[0].condition.value');
        const loopedForkField = _.get(req.form.options.forks, '[0].condition.field');
        const loopedFieldMatchesForkCondition = loopedForkField &&
          req.form.values[loopedForkField] === loopedForkCondition;

        if (req.sessionModel.get('redirect-to-information-you-have-given-us') &&
          !isContinueOnEdit && !loopedFieldMatchesForkCondition) {
          return res.redirect('/acrs/information-you-have-given-us');
        }

        return next();
      } catch (e) {
        return next(e);
      }
    });
  }

  /**
   * Checks if continueOnEdit is set on the form or on the selected fork
   *
   * @param {Object} formOptions - The form configuration (options), typically matching index.js/steps
   * @param {Object} formValues - The form input values, typically from the request as { field: 'value', ... }
   * @return {boolean} true if the form should continue on edit
   */
  isChoiceContinueOnEdit(formOptions, formValues) {
    if (formOptions.continueOnEdit) {
      return true;
    }

    const chosenOption = formOptions.forks?.find(fork => {
      return formValues[fork.condition.field] === fork.condition.value;
    });
    return Boolean(chosenOption && chosenOption.continueOnEdit);
  }
};
