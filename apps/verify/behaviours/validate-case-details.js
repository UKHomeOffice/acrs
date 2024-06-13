/* eslint-disable dot-notation */
const config = require('../../../config');
const axios = require('axios');
const logger = require('hof/lib/logger')({ env: config.env });

const baseUrl = `${config.saveService.host}:${config.saveService.port}/verify_lookup`;

module.exports = superclass => class extends superclass {
  async saveValues(req, res, next) {
    const queryColumn = req.sessionModel.get('sign-in-method') ?? null;
    const queryValue = req.form.values[queryColumn]?.toUpperCase() ?? null;
    req.form.values[queryColumn] = queryValue;
    if (!queryColumn || !queryValue) {
      return res.redirect('/incorrect-details-brp');
    }

    const validCase = await this.isValidCase(req, queryColumn, queryValue);
    if (!validCase) {
      return res.redirect(`/incorrect-details-${queryColumn}`);
    }
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
