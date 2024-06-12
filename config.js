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
    csvReportTemplateId: process.env.CSV_REPORT_TEMPLATE_ID
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
    port: process.env.DATASERVICE_SERVICE_PORT_HTTPS || '3000',
    host: process.env.DATASERVICE_SERVICE_HOST &&
      `https://${process.env.DATASERVICE_SERVICE_HOST}` || 'http://127.0.0.1'
  },
  upload: {
    maxFileSize: '25mb',
    allowedMimeTypes: [
      'application/json',
      'application/msword',
      'application/pdf',
      'application/rtf',
      'application/vnd.ms-excel',
      'application/vnd.ms-outlook',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/xml',
      'application/x-tika-ooxml',
      'audio/vnd.wave',
      'audio/wav',
      'audio/x-wav',
      'image/bmp',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'message/rfc822',
      'text/csv',
      'text/plain',
      'text/xml'
    ],
    hostname: process.env.FILE_VAULT_URL || 'http://localhost:3003/file'
  },
  keycloak: {
    token: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET
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
    fields: ['user-email', 'id-type', 'brp', 'uan', 'date-of-birth', 'csrf-secret', 'errorValues', 'errors']
  },
  hosts: {
    acceptanceTests: process.env.ACCEPTANCE_HOST_NAME || `http://localhost:${process.env.PORT || 8080}`
  },
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:mm:ss',
  dobFormat: 'YYYY-MM-DD',
  dobCutoff: '2003-08-23'
};
