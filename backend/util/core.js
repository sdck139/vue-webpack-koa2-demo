'use strict'

function escapeRegexp(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

module.exports = {

  format: require('util').format,

  uuid: require('uuid').v4,

  os: require('os'),

  pid: process.pid,

  escapeRegexp: escapeRegexp
}
