'use strict'


exports.checkSession = async(ctx, next) => {
  const sess = ctx.session
  if (!sess.uid && !sess.wxid) {
    return
  }

  await next()
}
