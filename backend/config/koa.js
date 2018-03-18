'use strict'

module.exports = {

  port: 8888,

  cookieExpires: 30 * 60 * 1000,
  sessionRedisDb: 14,

  logFormat: '[backend/module/koa-server] :method :status :url :response-timems :remote-addr',
  logLevel: 'auto'

}
