'use strict'

const _ = require('lodash')

const ret = {

  OK: { errcode: 0, errmsg: 'OK' },

  WRONG_PARAM: { errcode: 15010002, errmsg: '参数错误' },

  NOT_AUTHORIZED: { errcode: 15010003, errmsg: '您没有调用该接口的权限' },

  NOT_LOGINED: { errcode: 15010004, errmsg: '您还未登录' },

  LOGIN_ERROR: { errcode: 10010006, errmsg: '账号或密码错误' }

}

ret.with = function(type, data) {
  return _.assign(data, ret[type])
}

module.exports = ret
