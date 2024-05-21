'use strict';
/* eslint no-process-env: 0 */

const env = process.env.NODE_ENV || 'production';

module.exports = {
  env: env,
  dataDirectory: './data',
  govukNotify: {
    notifyApiKey: process.env.NOTIFY_STUB === 'true' ? 'USE_MOCK' : process.env.NOTIFY_KEY,
    userAuthTemplateId: process.env.USER_AUTHORISATION_TEMPLATE_ID,
    caseworkerEmail: process.env.CASEWORKER_EMAIL,
    saveAndExitTemplateId: process.env.SAVE_AND_EXIT_TEMPLATE_ID,
    submissionTemplateId: process.env.SUBMISSION_TEMPLATE_ID,
    caseworkerSubmissionTemplateId: process.env.CASEWORKER_SUBMISSION_TEMPLATE_ID
  },
  saveService: {
    postgresDateFormat: 'YYYY-MM-DD HH:mm:ss',
    port: process.env.DATASERVICE_SERVICE_PORT_HTTPS,
    host: process.env.DATASERVICE_SERVICE_HOST &&
      `https://${process.env.DATASERVICE_SERVICE_HOST}` || 'http://127.0.0.1'
  },
  redis: {
    port: process.env.REDIS_PORT || '6379',
    host: process.env.REDIS_HOST || '127.0.0.1'
  },
  login: {
    tokenExpiry: 1800,
    appPath: '/acrs/start',
    invalidTokenPath: '/acrs/token-invalid',
    allowSkip: String(process.env.ALLOW_SKIP) === 'true',
    skipEmail: process.env.SKIP_EMAIL
  },
  sessionDefaults: {
    steps: ['/start', '/select-form', '/information-you-have-given-us', '/who-completing-form'],
    fields: ['user-email', 'id-type', 'brp', 'uan', 'date-of-birth', 'csrf-secret', 'errorValues', 'errors']
  },
  hosts: {
    acceptanceTests: process.env.ACCEPTANCE_HOST_NAME || `http://localhost:${process.env.PORT || 8080}`
  },
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:mm:ss'
};
