'use strict'

const Define = require('../../define/_index')
const Ret = Define.ret
const Config = require('../../config/_index')

exports.helloGet = async(ctx) => {
  ctx.body = {msg: 'hello world!'}
}
