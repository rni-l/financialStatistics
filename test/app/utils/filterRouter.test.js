/**
 * 功能
 */
const assert = require('assert')
const filterRouter = require('../../../app/utils/filterRouter.js')

describe('test/utils/filterRouter.test.js', () => {
  const list = [
    { matchMethod: 'GET', matchUrl: '/api/cms/user', request: { path: '/api/cms/user', method: 'GET' }, result: true },
    { matchMethod: 'POST', matchUrl: '/api/cms/user', request: { path: '/api/cms/user', method: 'POST' }, result: true },
    { matchMethod: 'GET', matchUrl: '/api/cms/user', request: { path: '/api/cms/u1ser', method: 'GET' }, result: false },
    { matchMethod: 'GET', matchUrl: '/api/cms/u1ser', request: { path: '/api/cms/user', method: 'GET' }, result: false },
    { matchMethod: 'GET', matchUrl: '/api/cms/user', request: { path: '/api/cms/user', method: 'POST' }, result: false },
    { matchMethod: 'POST', matchUrl: '/api/cms/user', request: { path: '/api/cms/user', method: 'GET' }, result: false },
    // 末尾带参数的 - get
    { matchMethod: 'GET', matchUrl: '/api/cms/user', request: { path: '/api/cms/user/', method: 'GET' }, result: true },
    { matchMethod: 'GET', matchUrl: '/api/cms/user', request: { path: '/api/cms/user?', method: 'GET' }, result: true },
    { matchMethod: 'GET', matchUrl: '/api/cms/user', request: { path: '/api/cms/user?id=1', method: 'GET' }, result: true },
    { matchMethod: 'GET', matchUrl: '/api/cms/user', request: { path: '/api/cms/user?id=1&page=1', method: 'GET' }, result: true },
    { matchMethod: 'GET', matchUrl: '/api/cms/user/:id', request: { path: '/api/cms/user/', method: 'GET' }, result: false },
    { matchMethod: 'GET', matchUrl: '/api/cms/user/:id', request: { path: '/api/cms/user/123', method: 'GET' }, result: true },
    { matchMethod: 'GET', matchUrl: '/api/cms/user/:id', request: { path: '/api/cms/user/123?id=1', method: 'GET' }, result: true },
    { matchMethod: 'GET', matchUrl: '/api/cms/user/:id', request: { path: '/api/cms/user/123&id=1', method: 'GET' }, result: true },
    // 末尾带参数的 - post
    { matchMethod: 'POST', matchUrl: '/api/cms/user', request: { path: '/api/cms/user/', method: 'POST' }, result: true },
    { matchMethod: 'POST', matchUrl: '/api/cms/user', request: { path: '/api/cms/user?', method: 'POST' }, result: false },
    { matchMethod: 'POST', matchUrl: '/api/cms/user', request: { path: '/api/cms/user?id=1', method: 'POST' }, result: false }
  ]

  list.forEach(v => {
    it(`${v.matchMethod}, 请求： ${JSON.stringify(v.request)}, 匹配的 url: ${v.matchUrl}，预测结果：${v.result ? '匹配' : '不匹配'}`, () => {
      assert(filterRouter(v.request, v.matchUrl, v.matchMethod) === v.result)
    })
  })
})
