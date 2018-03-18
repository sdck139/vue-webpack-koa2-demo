'use strict'

const path = require('path')

const ROOT_PATH = path.normalize(`${__dirname}/../..`)

module.exports = {
  appName: require('../../package.json').name,
  isDevelopment: process.env.NODE_ENV === 'development',

  rootPath: ROOT_PATH,
  backendPath: path.join(ROOT_PATH, 'backend'),
  frontendPath: path.join(ROOT_PATH, 'frontend'),
  logPath: path.join(ROOT_PATH, 'log')
}
