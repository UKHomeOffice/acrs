'use strict';

const env = process.env.NODE_ENV || 'production';

module.exports = {
  aws: {
    bucket: process.env.AWS_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: process.env.AWS_SIGNATURE_VERSION,
    kmsKeyId: process.env.AWS_KMS_KEY_ID,
    region: process.env.AWS_REGION || 'eu-west-2'
  },
  casesIds: {
    uanValidLength: 19,
    cronEnabled: process.env.CRON_ENABLED,
    S3Id: process.env.CASES_S3_ID || 'uans-data-2023-04-23',
    testCases: [{
      uan: '0000-0000-0000-0000', cepr: '000000000', brp: 'RJ0000000', 'date-of-birth': '2000-01-01'
    }, {
      uan: '0000-0000-0000-0001', cepr: '0000000001', brp: 'RJ0000001', 'date-of-birth': '2000-01-01'
    }, {
      uan: '0000-0000-0000-0002', cepr: '0000000003', brp: 'RJ0000003', 'date-of-birth': '2000-01-01'
    }, {
      uan: '0000-0000-0000-0003', cepr: '0000000004', brp: 'RJ0000004', 'date-of-birth': '2000-01-01'
    }, {
      uan: '0000-0000-0000-0004', cepr: '0000000005', brp: 'RJ0000005', 'date-of-birth': '2000-01-01'
    }, {
      uan: '0000-0000-0000-0005', cepr: '0000000006', brp: 'RJ0000006', 'date-of-birth': '2000-01-01'
    }, {
      uan: '0000-0000-0000-0006', cepr: '0000000007', brp: 'RJ0000007', 'date-of-birth': '2000-01-01'
    }, {
      uan: '0000-0000-0000-0007', cepr: '0000000008', brp: 'RJ0000008', 'date-of-birth': '2000-01-01'
    }]
  },
  dataDirectory: './data',
  dateTimeFormat: 'DD MMM YYYY HH:mm:ss',
  env: env,
  hosts: {
    acceptanceTests: process.env.ACCEPTANCE_HOST_NAME || `http://localhost:${process.env.PORT || 8080}`
  },
  govukNotify: {
    notifyApiKey: process.env.NOTIFY_STUB === 'true' ? 'USE_MOCK' : process.env.NOTIFY_KEY,
    userAuthTemplateId: process.env.USER_AUTHORISATION_TEMPLATE_ID,
    caseworkerEmail: process.env.CASEWORKER_EMAIL,
    saveAndExitTemplateId: process.env.SAVE_AND_EXIT_TEMPLATE_ID,
    submissionTemplateId: process.env.SUBMISSION_TEMPLATE_ID,
    caseworkerSubmissionTemplateId: process.env.CASEWORKER_SUBMISSION_TEMPLATE_ID
  },
  redis: {
    port: process.env.REDIS_PORT || '6379',
    host: process.env.REDIS_HOST || '127.0.0.1'
  },
  keycloak: {
    token: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET
  },
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY'
};
