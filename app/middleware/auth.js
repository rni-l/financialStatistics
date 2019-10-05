// const defaultPermissions = require('../const/permission')
// const filterRouter = require('../utils/filterRouter')

module.exports = () => {
  return async function auth(ctx, next) {
    const { token } = ctx.session.userInfo || {}
    if (!token) {
      ctx.body = {
        code: 555,
        data: '请重新登录'
      }
      return
    }
    await next()
  }
}
