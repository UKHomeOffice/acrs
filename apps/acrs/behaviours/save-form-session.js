/* eslint-disable camelcase */

const axios = require('axios');
const config = require('../../../config');
const _ = require('lodash');

const applicationsUrl = `${config.saveService.host}:${config.saveService.port}/saved_applications`;
const { isOver18 } = require('../../../lib/utilities');

/**
* Checks session for a situation where all referrals have been removed
* User must refer at least one person from their age group's aggregator sections
*
* @param {Object} req - The request object
* @return {bool} Is there a state where no people are being referred?
*/
const noReferral = req => {
  if (isOver18(req.sessionModel.get('date-of-birth'))) {
    return req.sessionModel.get('partner') === 'no' &&
    req.sessionModel.get('children') === 'no' &&
    req.sessionModel.get('additional-family') === 'no';
  }
  return req.sessionModel.get('parent') === 'no' &&
  req.sessionModel.get('brother-or-sister') === 'no' &&
  req.sessionModel.get('additional-family') === 'no';
};

/**
* Conditional route navigation for aggregator yes/no intro questions
* Routing from these pages depends on form progress and aggregator store content
* Navigate the user to the correct route when HOF routing is not sufficient
*
* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @param {string} formFieldName - The name of the aggregator field with the yes/no question.
* @param {string} aggregatorStoreName - The name of the session array storing this aggregator's values.
* @param {string} summaryPath - The path name of the summary for this aggregator.
* @return res.redirect to the correct target path.
*/
const navigateFromYesNoQuestion = (req, res, formFieldName, aggregatorStoreName, summaryPath) => {
  const hasSeenFinalSummary = req.sessionModel.get('steps').includes('/email-decision') ||
    req.sessionModel.get('steps').includes('/decision-postal-address');
  const comesFromInitialSummary = req.sessionModel.get('redirect-to-information-you-have-given-us');
  const formFieldValue = req.form.values[formFieldName];
  const aggregatorStore = req.sessionModel.get(aggregatorStoreName);

  // Redirect if there is no referral in session
  if (noReferral(req)) {
    return res.redirect('/acrs/no-family-referred');
  } else if (formFieldValue === 'yes' && aggregatorStore?.aggregatedValues?.length) {
    return res.redirect(summaryPath);
  } else if (formFieldValue === 'no' && hasSeenFinalSummary && !comesFromInitialSummary) {
    return res.redirect('/acrs/confirm');
  }

  return null;
};

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

        const currentRoute = req.form.options.route;
        // Manage routing for aggregate: Parent
        if (currentRoute === '/parent') {
          navigateFromYesNoQuestion(req, res, 'parent', 'referred-parents', '/acrs/parent-summary');
        }
        // Manage routing for aggregate: Siblings
        if (currentRoute === '/brother-or-sister') {
          navigateFromYesNoQuestion(req, res, 'brother-or-sister', 'referred-siblings', '/acrs/brother-or-sister-summary');
        }
        // Manage routing for aggregate: Partner
        if (currentRoute === '/partner') {
          navigateFromYesNoQuestion(req, res, 'partner', 'referred-partners', '/acrs/partner-summary');
        }
        // Manage routing for aggregate: Children
        if (currentRoute === '/children') {
          navigateFromYesNoQuestion(req, res, 'children', 'referred-children', '/acrs/children-summary');
        }
        // Manage routing for aggregate: Additional family
        if (currentRoute === '/additional-family') {
          navigateFromYesNoQuestion(req, res, 'additional-family', 'referred-additional-family', '/acrs/additional-family-summary');
        }
        // Manage routing for aggregate: Family in the UK
        if (currentRoute === '/family-in-uk') {
          navigateFromYesNoQuestion(req, res, 'has-family-in-uk', 'family-member-in-uk', '/acrs/family-in-uk-summary');
        }

        const isContinueOnEdit = req.form.options.continueOnEdit &&
          _.get(req.form.options.forks, '[0].continueOnEdit');

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
};
