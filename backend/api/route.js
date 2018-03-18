'use strict'

const Base = require('./base/_index')
const ApiV1 = require('./v1/_index')

module.exports = (app) => {
  ApiV1(app)
  Base(app)
}
