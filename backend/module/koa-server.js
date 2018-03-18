'use strict'

const fs = require('fs')
const path = require('path')
const https = require('https')

const Koa = require('koa')
const Promise = require('bluebird')
const favicon = require('koa-favicon')
const koaStatic = require('koa-static')
const compress = require('koa-compress')
const session = require('koa-session2')
const koaLogger = require('koa-log4').koaLogger
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')
const Config = require('../config/_index')
// const Helper = require('../helper/_index')
// const RedisStore = Helper.redisStore
const Util = require('../util/_index')
const logger = Util.logger(__filename)

const app = new Koa()


app.use(koaLogger(logger, {
  format: Config.koa.logFormat,
  level: Config.koa.logLevel
}))

app.use(favicon(path.join(Config.base.frontendPath, 'assets/favicon.ico'), {
  maxAge: 1000 * 60 * 60 * 24 * 7
}))

app.use(compress({
  level: 6,
  filter: function(contentType) {
    if (/event-stream/i.test(contentType)) {
    // 为了让hot reload生效，不对__webpack_hmr压缩
      return false
    } else {
      return true
    }
  }
}))

app.use(bodyParser())

// app.use(session({
//   key: Config.base.appName,
//   maxAge: Config.koa.cookieExpires,
//   secure: !Config.base.isDevelopment,

//   store: new RedisStore({
//     prefix: Config.base.appName,
//     host: Config.redis.host,
//     port: Config.redis.port,
//     password: Config.redis.pwd,
//     db: Config.koa.sessionRedisDb
//   })
// }))

app.use((ctx, next) => {
  const sess = ctx.session
  const headers = ctx.headers
  const body = ctx.request.body
  return next()
})

if (Config.base.isDevelopment) {
  app.use(convert(koaStatic(Config.base.frontendPath, { maxage: 0, index: false })))
} else {
  app.use(convert(koaStatic(Config.base.frontendPath, { maxage: 30 * 24 * 60 * 60 * 1000, index: false })))
}

require('../api/route')(app)

module.exports = () => {
  const options = {
    key: fs.readFileSync(`${Config.base.backendPath}/ssl/key.pem`),
    cert: fs.readFileSync(`${Config.base.backendPath}/ssl/cert.pem`)
  }

  return new Promise(resolve => {
    https.createServer(options, app.callback()).listen(Config.koa.port, () => {
      logger.info(`Koa https server listening on port ${Config.koa.port}`)
      resolve(app)
    })
  })
}
