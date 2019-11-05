'use strict'

const BaseController = require('../index')
const { id, name, price, openDate, receiveDate, staffInfo, status } = require('../../dto/bill')
const { SUCCESS_CODE, ID_EMPTY } = require('../../const/codeType')

const createDescribe = {
  name,
  price,
  openDate,
  receiveDate,
  staffInfo
}
const updateDescribe = {
  id,
  ...createDescribe
}
const queryDescribe = {
  name: {
    ...name,
    required: false
  },
  openDate: {
    ...openDate,
    required: false
  },
  receiveDate: {
    ...receiveDate,
    required: false
  },
  status: {
    ...status,
    required: false
  }
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
    const transactions = await this.ctx.helper.dbTransactions()
    // 连接失败
    if (!transactions.isSuccess) return (ctx.body = this.formatData(transactions))
    const { query, rollback, commit, beginTransaction } = transactions
    const beginTransactionResult = await beginTransaction()
    // 开启事务失败
    if (!beginTransactionResult.isSuccess) return (ctx.body = this.formatData(beginTransactionResult))
    // 插入数据
    const insertResult = await service.bill.index.create(params, query)
    if (insertResult.code !== SUCCESS_CODE) {
      await rollback()
      return (ctx.body = this.formatData(insertResult))
    }
    // 插入关联数据
    const insertRelevanceData = await service.bill.billStaff.create(
      {
        staffInfo: params.staffInfo,
        billId: insertResult.data.insertId
      },
      query
    )
    if (insertRelevanceData.code !== SUCCESS_CODE) {
      await rollback()
      return (ctx.body = this.formatData(insertRelevanceData))
    }
    const commitResult = await commit()
    if (!commitResult.isSuccess) return (ctx.body = this.formatData(commitResult))
    ctx.body = this.formatData({
      data: {},
      msg: '添加成功'
    })
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
    const transactions = await this.ctx.helper.dbTransactions()
    // 连接失败
    if (!transactions.isSuccess) return (ctx.body = this.formatData(transactions))
    const { query, rollback, commit, beginTransaction } = transactions
    const beginTransactionResult = await beginTransaction()
    // 开启事务失败
    if (!beginTransactionResult.isSuccess) return (ctx.body = this.formatData(beginTransactionResult))
    const updateResult = await service.bill.index.update(
      {
        ...params,
        status: params.receiveDate ? 1 : 0
      },
      query
    )
    if (updateResult.code !== SUCCESS_CODE) {
      await rollback()
      return (ctx.body = this.formatData(updateResult))
    }
    // 移除关联表
    const removeResult = await service.bill.billStaff.destroyByBillId(id, query)
    if (removeResult.code !== SUCCESS_CODE) {
      await rollback()
      return (ctx.body = this.formatError({ data: removeResult.data }))
    }
    // 更新关联表
    const insertRelevanceData = await service.bill.billStaff.create(
      {
        billId: id,
        staffInfo: params.staffInfo
      },
      query
    )
    if (insertRelevanceData.code !== SUCCESS_CODE) {
      await rollback()
      return (ctx.body = this.formatData(insertRelevanceData))
    }
    const commitResult = await commit()
    if (!commitResult.isSuccess) return (ctx.body = this.formatData(commitResult))
    ctx.body = this.formatData({
      data: {},
      msg: '修改成功'
    })
  }

  async destroy() {
    const { ctx, service } = this
    const id = Number(ctx.params.id)
    if (!this.checkId(id)) return false
    const data = await service.bill.index.destroy(id)
    await service.bill.billStaff.destroyByBillId(id)
    console.log(data)
    ctx.body = this.formatData({
      ...data,
      data: data.code === SUCCESS_CODE ? '删除成功' : data.data
    })
  }

  async index() {
    const { ctx } = this
    const query = ctx.request.query
    const { isSuccess, errorMsg } = await ctx.helper.validate(
      {
        openDate: Number(query.openDate) || '',
        receiveDate: Number(query.receiveDate) || '',
        status: Number(query.status) || '',
        name: query.name || ''
      },
      queryDescribe
    )
    if (!isSuccess) {
      return (ctx.body = this.formatError({ data: errorMsg }))
    }
    const data = await this.service.bill.index.index({
      ...query,
      curPage: query.curPage ? Number(query.curPage) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10
    })
    ctx.body = this.formatData(data)
  }

  async show() {
    const { ctx } = this
    const id = Number(ctx.params.id)
    if (!this.checkId(id)) return false
    const resultInfo = await this.service.bill.index.find(id)
    ctx.body = this.formatData(resultInfo)
  }

  async updateStatus() {
    const { ctx } = this
    const id = Number(ctx.params.id)
    if (!this.checkId(id)) return false
    const resultInfo = await this.service.bill.index.updateStatus(id)
    ctx.body = this.formatData(resultInfo)
  }

  async updateReceiveDate() {
    const { ctx } = this
    const id = Number(ctx.params.id)
    const { receiveDate } = ctx.request.body
    if (!this.checkId(id)) return false
    const { isSuccess, errorMsg } = await ctx.helper.validate({ receiveDate }, { receiveDate: createDescribe.receiveDate })
    if (!isSuccess) {
      return (ctx.body = this.formatError({ data: errorMsg }))
    }
    const resultInfo = await this.service.bill.index.updateReciveDate(id, receiveDate)
    ctx.body = this.formatData(resultInfo)
  }
}

module.exports = IndexController
