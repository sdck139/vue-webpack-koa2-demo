'use strict'

const Module = require('./backend/module/_index')
const Util = require('./backend/util/_index')
const logger = Util.logger(__filename)
const Config = require('./backend/config/_index')
const _ = require('lodash')


// function initRedisClient() {
//   return (Module.redisClient = require('./backend/module/redis-client')()).promise
// }

// function initMgClient() {
//   return (Module.mgClient = require('./backend/module/mg-client')()).promise
// }

function initKoaServer() {
  return require('./backend/module/koa-server')()
    .then(app => {
      Module.koaServer = app
    })
}


initKoaServer()
  .then(() => {
    logger.info('OK: app start')
  })
  .catch(err => {
    logger.error('ERR: app start:', err)
  })

process.on('uncaughtException', err => {
  logger.error('App uncaught exception:', err)

  process.nextTick(() => process.exit(1))
})
