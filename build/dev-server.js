'use strict'

const { PassThrough } = require('stream')
const devMiddleware = require('webpack-dev-middleware')
const path = require('path')
const _ = require('lodash')
const webpack = require('webpack')

const pkg = require('../package.json')
const buildConfig = require('./config')
const devConfig = require('./webpack.dev')
const frontendPath = path.join(__dirname, '../dist', pkg.name, 'frontend')

const hotMiddleware = require('webpack-hot-middleware')

const sendFile = (ctx, file) => {
  ctx.type = 'text/html'
  ctx.body = ctx.fileSystem.readFileSync(frontendPath + '/' + file)
}
const compiler = webpack(devConfig)

module.exports = (app, router) => {
  const expressMiddleware = devMiddleware(compiler, {
    noInfo: false,
    quiet: false,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300
    },
    stats: {
      colors: true
    },
    headers: { 'X-Custom-Header': 'yes' }
  })

  async function middleware(ctx, next) {
    ctx.fileSystem = expressMiddleware.fileSystem
    await expressMiddleware(ctx.req, {
      end: (content) => {
        ctx.body = content
      },
      setHeader: (name, value) => {
        ctx.set(name, value)
      }
    }, next)
  }

  middleware.fileSystem = expressMiddleware.fileSystem
  app.use(middleware)

  const hot = (compiler, opts) => {
    const expressMiddleware = hotMiddleware(compiler, opts)
    return async(ctx, next) => {
      const stream = new PassThrough()
      ctx.body = stream
      await expressMiddleware(ctx.req, {
        write: stream.write.bind(stream),
        writeHead: (status, headers) => {
          ctx.status = status
          ctx.set(headers)
        }
      }, next)
    }
  }

  app.use(hot(compiler))

  _.each(buildConfig.page, (v, k) => {
    router.get(v.path, async(ctx) => {
      sendFile(ctx, k + '.html')
    })
  })
}
