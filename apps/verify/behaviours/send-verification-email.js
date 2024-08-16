/* eslint max-len: 0 */
'use strict';

const config = require('../../../config');
const axios = require('axios');
const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyApiKey = config.govukNotify.notifyApiKey;
const notifyClient = new NotifyClient(notifyApiKey);
const templateId = config.govukNotify.userAuthTemplateId;
const baseUrl = `${config.saveService.host}:${config.saveService.port}/saved_applications`;
const tokenGenerator = require('../../../db/save-token');
const _ = require('lodash');

const getPersonalisation = (host, token, idType) => {
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return {
    // pass in `&` at the end in case there is another
    // query e.g. ?hof-cookie-check
    link: `${protocol}://${host + config.login.appPath}?token=${token}&`,
    host: `${protocol}://${host}`,
    idType: idType === 'brp' ? 'BRP number' : 'UAN'
  };
};

module.exports = superclass => class extends superclass {
  skipEmailVerification(email) {
    if (email) {
      // eslint-disable-next-line no-param-reassign
      email = email.toLowerCase();
    }
    return config.login.allowSkip && email === config.login.skipEmail;
  }

  // fork to error page when an email domain is not recognised
  getNextStep(req, res) {
    const email = req.form.values['user-email'];

    if (this.skipEmailVerification(email)) {
      return res.redirect(`${config.login.appPath}?token=skip`);
    }

    return super.getNextStep(req, res);
  }

  async saveValues(req, res, next) {
    const host = req.get('host');
    const email = req.form.values['user-email'] || req.sessionModel.get('user-email');

    if (this.skipEmailVerification(email)) {
      return super.saveValues(req, res, next);
    }

    const brp = req.sessionModel.get('brp');
    const uan = req.sessionModel.get('uan');

    let idRoute = '';
    let idType = '';
    let id = '';

    if (!brp) {
      id = uan;
      idType = 'uan';
      idRoute = '/uan/';
    }else{
      id = brp;
      idType = 'brp';
      idRoute = '/brp/';
    }
    
    const response = await axios.get(baseUrl + idRoute + id);
    const unSubmittedCases = _.filter(response.data, record => !record.submitted_at);
    const firstUnsubmittedCase = unSubmittedCases.find(()=> true);
    
   // If user has unsubmitted application with different email throw error
    if (unSubmittedCases?.length > 0 && firstUnsubmittedCase.email !== email) {   
      return next({
        'user-email': new this.ValidationError(
          'user-email',
          {
            type: 'noRecordMatch'
          }
        )
      });
    }
    
    const token = tokenGenerator.save(req, email);
    
    try {
      const govNotifyResponse = await notifyClient.sendEmail(templateId, email, {
        personalisation: getPersonalisation(host, token, idType)
      
      
      });
      
      
      if (govNotifyResponse.status !== 201 && govNotifyResponse.status !== 200) {
        return next({
          'user-email': new this.ValidationError(
            'user-email',
            {
              type: 'errorMessage'
            }
          )
        });
      }
    } catch(error) {
      
      const errorDetails = error.response?.data ? `Cause: ${JSON.stringify(error.response.data)}` : '';
      const errorCode = error.code ? `${error.code} -` : '';
      const errorMessage = `${errorCode} ${error.message}; ${errorDetails}`;
      
      req.log('error',`Failed to send feedback email: ${errorMessage}`);
      
      return next({
        'user-email': new this.ValidationError(
          'user-email',
          {
            type: 'errorMessage'
          }
        )
      });
    }

    return super.saveValues(req, res, next);
  }
};
