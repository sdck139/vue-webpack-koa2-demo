'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const mongoose = require('mongoose')

const Config = require('../config/_index')
const Util = require('../util/_index')
const logger = Util.logger(__filename)

Promise.promisifyAll(mongoose)
mongoose.Promise = Promise

module.exports = function() {
  let mgClient
  let connStr
  const mdbArr = []
  const replset = Config.mongo.replset.split(',')
  const opts = { db: { readPreference: 'secondaryPreferred' } }

  if (Config.mongo.replset) {
    _.each(replset, function(e) {
      mdbArr.push(Util.core.format(
        '%s:%s@%s/%s',
        Config.mongo.user,
        Config.mongo.pwd,
        e,
        Config.mongo.db
      ))
    })
  } else {
    mdbArr.push(Util.core.format(
      '%s:%s@%s:%s/%s',
      Config.mongo.user,
      Config.mongo.pwd,
      Config.mongo.host,
      Config.mongo.port,
      Config.mongo.db
    ))
  }

  connStr = 'mongodb://' + mdbArr.join(',')
  mgClient = mongoose.createConnection(connStr, opts)

  mgClient.Schema = function(schema, options) {
    schema._id = { type: String, default: Util.core.uuid }
    if (!options) {
      [].push.call(arguments, { _id: false })
    } else {
      options._id = false
    }

    mgClient.base.Schema.apply(this, arguments)
  }
  mgClient.Schema.prototype = new mgClient.base.Schema()
  mgClient.Schema.Types = mgClient.base.Schema.Types
  mgClient.originalModel = mgClient.model
  mgClient.model = function(collectionName, schema) {
    if (!schema) {
      return mgClient.originalModel(collectionName)
    }
    schema.options = schema.options || {}
    schema.options.collection = collectionName
    schema.options.versionKey = false
    schema.options.bufferCommands = false
    return mgClient.originalModel(collectionName, schema)
  }

  mgClient.promise = new Promise(function(resolve, reject) {
    mgClient.once('open', function() {
      logger.info('OK: mongodb connected: %j', Config.mongo)
      resolve(mgClient)
    })

    mgClient.on('error', function(err) {
      logger.info('ERR: mongodb connect error:', err)
      reject(err)
    })

    mgClient.on('connected', function() {
      logger.info('MongoDB connected!')
    })

    mgClient.on('reconnected', function() {
      logger.info('MongoDB reconnected!')
    })

    mgClient.on('disconnected', function() {
      logger.info('MongoDB disconnected!')

      setTimeout(function() {
        mgClient.open(connStr)
      }, 5000)
    })
  })

  return mgClient
}
