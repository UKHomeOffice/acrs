/* eslint-disable camelcase */

const axios = require('axios');
const config = require('../../../config');

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

        return next();
      } catch (e) {
        return next(e);
      }
    });
  }
};
