'use strict'

const BaseController = require('../index')
const { id, code, name, address, remark } = require('../../dto/store')
const { SUCCESS_CODE, ID_EMPTY } = require('../../const/codeType')

const createDescribe = {
  code,
  name,
  address,
  remark
}
const updateDescribe = {
  id,
  ...createDescribe
}

class IndexController extends BaseController {
  checkId(id) {
    if (!id) {
      this.ctx.body = this.formatError(ID_EMPTY)
      return false
    }
    return true
  }

  async create() {
    const { ctx, service } = this
    const params = ctx.request.body
    const { isSuccess, errorMsg } = await ctx.helper.validate(params, createDescribe)
    if (!isSuccess) {
      return (ctx.body = this.formatError({ data: errorMsg }))
    }
    const data = await service.store.index.create({
      ...params
    })
    ctx.body = this.formatData(data)
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
    const data = await service.store.index.update({
      ...params
    })
    ctx.body = this.formatData(data)
  }

  async destroy() {
    const { ctx } = this
    const id = Number(ctx.params.id)
    if (!this.checkId(id)) return false
    const data = await this.service.store.index.destroy(id)
    ctx.body = this.formatData({
      ...data,
      data: data.code === SUCCESS_CODE ? '删除成功' : data.data
    })
  }

  async show() {
    const { ctx } = this
    const id = Number(ctx.params.id)
    if (!this.checkId(id)) return false
    const data = await this.service.store.index.find(id)
    ctx.body = this.formatData(data)
  }

  async index() {
    const { ctx } = this
    const query = ctx.request.query
    const data = await this.service.store.index.index({
      ...query,
      curPage: query.curPage ? Number(query.curPage) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10
    })
    ctx.body = this.formatData(data)
  }
}

module.exports = IndexController
