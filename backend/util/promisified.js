'use strict'

const fs = require('fs')
const Promise = require('bluebird')

module.exports = {

  fs: Promise.promisifyAll(fs)

}
