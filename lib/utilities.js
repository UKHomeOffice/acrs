const config = require('../config');
const moment = require('moment');

class NotifyMock {
  sendEmail() {
    return Promise.resolve();
  }

  sendSms() {
    return Promise.resolve();
  }

  prepareUpload() {}
}

const secondsBetween = (startDate, endDate) => {
  const dif = endDate - startDate;
  const secondsFromStartToEnd = dif / 1000;
  return Math.abs(secondsFromStartToEnd);
};

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Calculate if the given date is before the cutoff date.
 *
 * @param {string} date - The date to compare.
 * @param {string} cutoff - The cutoff date.
 * @param {string} format - The format of the dates i.e. 'YYYY-MM-DD'.
 * @return {boolean} Whether the date is before the cutoff date.
 */
const calcDateBefore = (date, cutoff, format) => {
  const mDate = moment(date, format);
  const mCutoff = moment(cutoff, format);
  return mDate.isBefore(mCutoff);
};

const isOver18 = dob => {
  return calcDateBefore(dob, config.dobCutoff, config.dobFormat);
};

module.exports = {
  capitalize,
  secondsBetween,
  NotifyClient: config.govukNotify.notifyApiKey === 'USE_MOCK' ?
    NotifyMock : require('notifications-node-client').NotifyClient,
  isOver18,
  calcDateBefore
};
