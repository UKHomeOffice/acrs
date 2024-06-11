/* eslint-disable dot-notation */
const config = require('../../../config');
const axios = require('axios');
const logger = require('hof/lib/logger')({ env: config.env });

const baseUrl = `${config.saveService.host}:${config.saveService.port}/verify_lookup`;
const getIdType = brp => !brp ? 'uan' : 'brp';
module.exports = superclass => class extends superclass {
  async saveValues(req, res, next) {
    const queryColumn = req.sessionModel.get('sign-in-method')

    if (!queryColumn) {
      return res.redirect('/incorrect-details-brp');
    }
    const queryValue = req.form.values[queryColumn];

    const validCase = await this.isValidCase(req, queryColumn, queryValue);
    if (!validCase) {
      return res.redirect(`/incorrect-details-${queryColumn}`);
    }
    req.sessionModel.set('brp', validCase.brp);
    req.sessionModel.set('uan', validCase.uan);
    req.sessionModel.set('id-type', queryColumn);
    req.sessionModel.set('date-of-birth', validCase.date_of_birth);
    return super.saveValues(req, res, next);
  }

  async isValidCase(req, queryColumn, queryValue) {
    const dob = req.form.values['date-of-birth'];

    try {
      const response = await axios.get(`${baseUrl}/${queryColumn}/${queryValue}`);
      const validCases = response.data;

      const foundCase = validCases.find(record => {
        return record[queryColumn] === req.form.values[queryColumn] && record['date_of_birth'] === dob;
      });

      req.sessionModel.set('service', 'acrs');

      return foundCase;
    } catch (error) {
      logger.log('error', `Could not get valid cases: ${error}`);
      return null;
    }
  }
};
