'use strict';
/* eslint-disable consistent-return, max-len */

const hof = require('hof');
const config = require('./config.js');
const _ = require('lodash');

let settings = require('./hof.settings');

settings = Object.assign({}, settings, {
  routes: settings.routes.map(require),
  behaviours: settings.behaviours.map(require)
});

if (!fs.existsSync(config.dataDirectory)) {
  fs.mkdirSync(config.dataDirectory);
}

const app = hof(settings);

app.use((req, res, next) => {
  const host = config.serviceUrl || req.get('host');
  const protocol = host.includes('localhost') ? 'http' : 'https';
  res.locals.formUrl = `${protocol}://${host}`;
  res.locals.htmlLang = 'en';
  res.locals.feedbackUrl = '/https://eforms.homeoffice.gov.uk/outreach/feedback.ofml';
  next();
});

if (config.env === 'development' || config.env === 'test') {
  app.use('/test/bootstrap-session', (req, res) => {
    const appName = req.body.appName;

    if (!_.get(req, 'session[`hof-wizard-${appName}`]')) {
      if (!req.session) {
        throw new Error('Redis is not running!');
      }
      req.session[`hof-wizard-${appName}`] = {};
    }

    Object.keys(req.body.sessionProperties || {}).forEach(key => {
      req.session[`hof-wizard-${appName}`][key] = req.body.sessionProperties[key];
    });

    res.send('Session populate complete');
  });
}

module.exports = app;
