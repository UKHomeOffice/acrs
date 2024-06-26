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
    customerReceiptTemplateId: process.env.CUSTOMER_RECEIPT_TEMPLATE_ID,
    submissionTemplateId: process.env.CASEWORKER_SUBMISSION_TEMPLATE_ID,
    csvReportTemplateId: process.env.CSV_REPORT_TEMPLATE_ID,
    submissionFailedTemplateId: process.env.SUBMISSION_FAILED_TEMPLATE_ID
  },
  keycloak: {
    token: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET
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
  upload: {
    maxFileSizeInBytes: 25 * 1000 * 1000, // 25MB in bytes
    hostname: process.env.FILE_VAULT_URL,
    allowedMimeTypes: [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'application/pdf',
      'text/plain',
      'text/html',
      'application/vnd',
      'message/rfc822',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/rtf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/xml'
    ]
  },
  login: {
    tokenExpiry: 1800,
    appPath: '/acrs/start',
    invalidTokenPath: '/acrs/link-expired',
    allowSkip: String(process.env.ALLOW_SKIP) === 'true',
    skipEmail: process.env.SKIP_EMAIL
  },
  sessionDefaults: {
    steps: ['/start', '/select-form', '/information-you-have-given-us', '/who-completing-form'],
    fields: [
      'user-email',
      'id-type',
      'sign-in-method',
      'brp',
      'uan',
      'date-of-birth',
      'csrf-secret',
      'errorValues',
      'errors'
    ]
  },
  hosts: {
    acceptanceTests: process.env.ACCEPTANCE_HOST_NAME || `http://localhost:${process.env.PORT || 8080}`
  },
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:mm:ss',
  dobFormat: 'YYYY-MM-DD',
  // dobCutoff is the earliest date of birth that qualifies as under 18, therefore 27 August 2003 is considered over 18
  dobCutoff: '2003-08-28',
  ageLimit: 18,
  uniqueReferralRefs: {
    refLength: 6,
    refAllowedChars: 'ABCDEFGHJKMNPRTUVWXY0123456789'
  }
};
