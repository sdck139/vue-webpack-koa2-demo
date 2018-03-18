'use strict'

const fs = require('fs')
const _ = require('lodash')
const KoaRouter = require('koa-router')

const Config = require('../../config/_index')
const Mid = require('./mid')

const pages = [
  { name: 'home', path: '/' }
]
const pageCache = {}
const sendFile = function(ctx, name) {
  ctx.type = 'text/html'
  ctx.body = pageCache[name]
}

module.exports = (app) => {
  const r1 = new KoaRouter()
  const r2 = new KoaRouter()

  // r2.use(Mid.checkSession)

  if (Config.base.isDevelopment) {
    require('../../../build/dev-server')(app, r2)
  } else {
    _.each(pages, (e) => {
      r2.get(e.path, async(ctx) => {
        sendFile(ctx, e.name)
      })
    })
  }

  r2.get('/*', async(ctx) => {
    if (!/api\/v1/.test(ctx.path)) {
      ctx.redirect('/')
      return
    }
  })

  app.use(r1.routes())
  app.use(r2.routes())
}
