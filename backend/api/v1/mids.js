'use strict'

exports.checkSession = async(ctx, next) => {
  const sess = ctx.session

  if (!sess.uid) {
    ctx.status = 401
    return
  }

  await next()
}
