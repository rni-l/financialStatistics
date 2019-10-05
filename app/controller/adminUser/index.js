'use strict'

const BaseController = require('../index')
const { id, name, status, password } = require('../../dto/adminUser')
const { SUCCESS_CODE, USER_NOT_FOUND } = require('../../const/codeType')

const createDescribe = {
  name,
  status,
  password
}
const loginDescribe = {
  name,
  password
}
const updateDescribe = {
  id,
  name,
  status
}

class IndexController extends BaseController {
  async create() {
    const { ctx, service } = this
    const params = ctx.request.body
    const { isSuccess, errorMsg } = await ctx.helper.validate(params, createDescribe)
    if (!isSuccess) {
      return (ctx.body = this.formatError({ data: errorMsg }))
    }
    const data = await service.adminUser.index.register({
      ...params,
      password: ctx.helper.encryption(params.password)
    })
    ctx.body = this.formatData(data)
  }

  async login() {
    const { ctx } = this
    const params = ctx.request.body
    const { isSuccess, errorMsg } = await ctx.helper.validate(params, loginDescribe)
    if (!isSuccess) {
      ctx.body = this.formatError({ data: errorMsg })
      return false
    }
    const data = await this.service.adminUser.index.login({
      ...params,
      password: ctx.helper.encryption(params.password)
    })
    const result = this.formatData(data)
    if (result.code !== SUCCESS_CODE) return (ctx.body = result)
    if (!result.data.id && result.data.id !== 0) {
      // 没有此用户
      return (ctx.body = USER_NOT_FOUND)
    }
    // 设置 token
    const token = result.data.id + ('' + Date.now())
    ctx.cookies.set('token', token)
    ctx.session.userInfo = {
      token,
      id: result.data.id
    }
    ctx.body = result
  }

  async logout() {
    const { ctx } = this
    ctx.session.userInfo = null
    ctx.cookies.set('token', null)
    ctx.body = this.formatData({ data: '登出成功' })
  }

  async update() {
    const { ctx, service } = this
    const { id } = ctx.params
    const body = ctx.request.body
    const params = {
      ...body,
      id: Number(id)
    }
    const { isSuccess, errorMsg } = await ctx.helper.validate(params, updateDescribe)
    if (!isSuccess) {
      return (ctx.body = this.formatError({ data: errorMsg }))
    }
    const data = await service.adminUser.index.update({
      ...params
    })
    ctx.body = this.formatData(data)
  }
}

module.exports = IndexController
