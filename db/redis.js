'use strict';

const Redis = require('ioredis');
const config = require('../config');

const redis = new Redis({
  port: config.redis.port,
  host: config.redis.host,
  connectionName: 'acrs-app'
});

module.exports = redis;
