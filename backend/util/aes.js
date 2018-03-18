'use strict'

const crypto = require('crypto')

exports.encrypt = (data, secretKey) => {
  const cipher = crypto.createCipher('aes-128-ecb', secretKey)
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
}

exports.decrypt = (data, secretKey) => {
  const cipher = crypto.createDecipher('aes-128-ecb', secretKey)
  return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8')
}
