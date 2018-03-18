'use strict'

const KoaRouter = require('koa-router')

const Main = require('./main')

module.exports = (app) => {
  const router = new KoaRouter({ prefix: '/api/v1' })
  // router.use(Mids.checkSession)
  router.get('/hello', Main.helloGet)
  app.use(router.routes()).use(router.allowedMethods())
}
