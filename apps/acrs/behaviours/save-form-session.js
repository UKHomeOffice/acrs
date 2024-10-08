/* eslint-disable camelcase */

const axios = require('axios');
const config = require('../../../config');

const applicationsUrl = `${config.saveService.host}:${config.saveService.port}/saved_applications`;

const requestBody = function (id, patchObj, postObj) {
  if(id === undefined || id.length === 0 ) {
    return {
      url: applicationsUrl,
      method: 'POST',
      data: postObj
    };
  }

  return {
    url: applicationsUrl + `/${id}`,
    method: 'PATCH',
    data: patchObj
  };
};

const getSession = function (req) {
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

  return session;
};
module.exports = superclass => class extends superclass {
  async saveValues(req, res, next) {
    return super.saveValues(req, res, async err => {
      if (err) {
        return next(err);
      }

      const session = getSession(req);

      // skip requesting data service api when running in local and test mode
      if (config.env === 'local' || config.env === 'test') {
        return next();
      }

      const id = req.sessionModel.get('id');
      const email = req.sessionModel.get('user-email');
      const uan = req.sessionModel.get('uan');
      const brp = req.sessionModel.get('brp');
      const date_of_birth = req.sessionModel.get('date-of-birth');

      const requestConfig = requestBody(id, { session }, { session, email, brp, uan, date_of_birth });

      req.log('info', `Saving Form Session: ${id}`);
      req.log('info', `Request ${JSON.stringify(requestConfig)}`);

      try {
        const response = await axios(requestConfig);
        req.log('info', `Response ${JSON.stringify(response.data)}`);
        const resBody = response.data;

        if (resBody && resBody.length && resBody[0].id) {
          req.sessionModel.set('id', resBody[0].id);
        } else {
          const errorMessage = `Id hasn't been recieved in response ${JSON.stringify(response.data)}`;
          req.log('error', errorMessage);
          return res.redirect('/acrs/information-saved');
        }

        if (req.body['save-and-exit']) {
          return res.redirect('/acrs/information-saved');
        }

        if(req.body.exit) {
          return res.redirect('/sign-in');
        }

        return next();
      } catch (e) {
        return next(e);
      }
    });
  }
};
