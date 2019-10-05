/**
 * @file router 一些配置
 */

const ignoreRouterArray = ['swagger', 'login', 'getToken']
const ignoreRouterArrayRegexp = ignoreRouterArray.map(v => new RegExp(v))

module.exports = {
  ignoreRouterArray,
  // 忽略不需要授权的路由
  ignoreFunc: ctx => {
    const url = ctx.url
    console.log(ctx.url, ctx.method)
    return ignoreRouterArray.some((routerName, index) => {
      return ignoreRouterArrayRegexp[index].test(url)
    })
  }
}
