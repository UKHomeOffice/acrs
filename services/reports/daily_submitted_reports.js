/* eslint-disable no-console */

const moment = require('moment');
const Reports = require('./reports');
const config = require('../../config.js');
const postgresDateFormat = config.saveService.postgresDateFormat;

module.exports = class DailySubmittedReports {
  static async createReport(type, logger) {
    try {
      const momentFormat = moment().utcOffset(0);
      const time12am = momentFormat.set({h: 0, m: 0, s: 0});
      // const time10am = moment().set({h: 10, m: 0, s: 0});


      const report = new Reports({
        type,
        tableName: 'saved_applications',
        from: time12am.clone().subtract(1, 'day').format(postgresDateFormat),
        to: time12am.clone().subtract(1, 'second').format(postgresDateFormat)
      });

      const response = await report.getRecordsWithProps({ timestamp: 'submitted_at' });

      await report.transformToAllQuestionsCsv(type, response.data);
      return await report.sendReport(type);
    } catch(e) {
      return logger ? logger.log('error', e) : console.error(e);
    }
  }
};
