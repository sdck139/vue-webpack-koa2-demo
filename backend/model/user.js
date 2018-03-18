'use strict'

const Module = require('../module/_index')
const mgClient = Module.mgClient
const Schema = mgClient.Schema

const UserSchema = new Schema({
  uid: String,
  area_code: String,
  create_date: {
    type: Number,
    default: Date.now
  },
  update_date: {
    type: Number,
    default: Date.now
  }
})

UserSchema.statics = {
  /*
  根据uid更新用户
   */
  updateByUid(uid, opts) {
    return this.update({ uid: uid }, opts, { safe: true })
  },
  /*
  根据uid查找用户
   */
  findOneByUid(uid) {
    return this.findOne({ uid: uid })
  }
}

module.exports = mgClient.model('user', UserSchema)
