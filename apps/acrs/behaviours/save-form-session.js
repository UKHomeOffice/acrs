/* eslint-disable camelcase, max-len */

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
* @return {string} - The path to navigate to if conditional is satisfied, else null.
*/
const aggIntroNavCheck = (req, formFieldName, aggregatorStoreName, summaryPath) => {
  const hasSeenFinalSummary = req.sessionModel.get('steps').includes('/email-decision') ||
    req.sessionModel.get('steps').includes('/decision-postal-address');
  const comesFromInitialSummary = req.sessionModel.get('redirect-to-information-you-have-given-us');
  const formFieldValue = req.form.values[formFieldName];
  const aggregatorStore = req.sessionModel.get(aggregatorStoreName);

  if (formFieldValue === 'yes' && aggregatorStore?.aggregatedValues?.length) {
    return summaryPath;
  } else if (formFieldValue === 'no' && hasSeenFinalSummary && !comesFromInitialSummary) {
    return '/acrs/confirm';
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

        // Handle conditional routing cases
        const currentRoute = req.form.options.route;
        let nextRoute;

        switch(currentRoute) {
          case '/parent':
            nextRoute = aggIntroNavCheck(req, 'parent', 'referred-parents', '/acrs/parent-summary');
            break;
          case '/brother-or-sister':
            nextRoute = aggIntroNavCheck(req, 'brother-or-sister', 'referred-siblings', '/acrs/brother-or-sister-summary');
            break;
          case '/partner':
            nextRoute = aggIntroNavCheck(req, 'partner', 'referred-partners', '/acrs/partner-summary');
            break;
          case '/children':
            nextRoute = aggIntroNavCheck(req, 'children', 'referred-children', '/acrs/children-summary');
            break;
          case '/additional-family':
            nextRoute = aggIntroNavCheck(req, 'additional-family', 'referred-additional-family', '/acrs/additional-family-summary');
            break;
          case '/family-in-uk':
            nextRoute = aggIntroNavCheck(req, 'has-family-in-uk', 'family-member-in-uk', '/acrs/family-in-uk-summary');
            break;
          case '/confirm':
            nextRoute = noReferral(req) ? '/acrs/no-family-referred' : null;
            break;
          default:
            nextRoute = null;
        }

        if (nextRoute) {
          return res.redirect(nextRoute);
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
