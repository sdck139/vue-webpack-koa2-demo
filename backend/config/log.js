'use strict'

const APP_NAME = require('./base').appName
const LOG_PATH = require('./base').logPath

const LOG_LEVEL = 'DEBUG'

const LOG_CONFIG = {

  defaultCategory: APP_NAME,

  defaultLogPath: LOG_PATH,

  logKeepDays: 30,

  appenders: [
    {
      type: 'dateFile',
      category: 'console'
    },
    {
      type: 'dateFile',
      category: APP_NAME
    }
  ],
  levels: {}
}

LOG_CONFIG.levels.console = LOG_LEVEL
LOG_CONFIG.levels[APP_NAME] = LOG_LEVEL

module.exports = LOG_CONFIG
