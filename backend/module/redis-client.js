'use strict'

var Promise = require('bluebird')
var redis = require('redis')

var Config = require('../config/_index')
var Util = require('../util/_index')
var logger = Util.logger(__filename)

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

module.exports = function() {
  var redisClient = redis.createClient(Config.redis.port, Config.redis.host)

  redisClient.promise = new Promise(function(resolve, reject) {
    redisClient.auth(Config.redis.pwd, function(err) {
      if (err) {
        reject(err)
      }
    })
    redisClient.select(Config.redis.db)
    redisClient.on('ready', function() {
      logger.info('OK: redis connected: %j', Config.redis)
      resolve(redisClient)
    })

    redisClient.on('connect', function() {
      logger.info('redis client on connect')
    })

    redisClient.on('reconnecting', function() {
      logger.info('redis client is reconnecting')
    })

    redisClient.on('error', function(err) {
      logger.info('ERR: redis client error:', err)
    })
  })

  return redisClient
}
