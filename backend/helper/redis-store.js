'use strict'

const _ = require('lodash')
const redis = require('redis')
const { Store } = require('koa-session2')
const Promise = require('bluebird')
const Util = require('../util/_index')
const logger = Util.logger(__filename)

Promise.promisifyAll(redis.RedisClient.prototype)

class RedisStore extends Store {
  constructor(opts) {
    super()
    this._ready = false
    this.opts = opts
    this.opts.keyPrefix = opts.prefix + ':sess'
    this.redis = redis.createClient(_.pick(opts, ['host', 'port', 'password', 'db']))

    this.redis.on('ready', () => {
      this._ready = true
      logger.info('OK: session redis client connected')
    })
    this.redis.on('end', () => {
      this._ready = false
      logger.info('OK: session redis client end')
    })
    this.redis.on('error', (err) => {
      this._ready = false
      logger.error('ERR: session redis client error:', err)
    })
  }

  async get(sid) {
    if (!this._ready) {
      return
    }

    let data = await this.redis.getAsync(`${this.opts.keyPrefix}:${sid}`)
    return JSON.parse(data)
  }

  async set(sess, opts) {
    if (!this._ready) {
      return
    }

    if (!opts.sid) {
      opts.sid = this.getID(24)
    }

    await this.redis.setexAsync(`${this.opts.keyPrefix}:${opts.sid}`, opts.maxAge / 1000, JSON.stringify(sess))
    return opts.sid
  }

  async destroy(sid) {
    if (!this._ready) {
      return
    }
    const result = await this.redis.delAsync(`${this.opts.keyPrefix}:${sid}`)
    return result
  }
}

module.exports = RedisStore
