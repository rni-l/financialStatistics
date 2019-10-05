'use strict'

const BaseController = require('../index')
const { id, storeCode, name, jobId, bonusRatio, isIgnorePlatform } = require('../../dto/staff')
const { SUCCESS_CODE, ID_EMPTY, STORE_EMPTY, STAFF_JOBID_ERROR } = require('../../const/codeType')

const createDescribe = {
  storeCode,
  name,
  jobId,
  bonusRatio,
  isIgnorePlatform
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

  async checkStore(storeCode) {
    // 查询该门店是否存在
    const storeResult = await this.service.store.index.find(storeCode, 'code')
    if (storeResult.code !== SUCCESS_CODE) {
      return {
        data: this.formatError(storeResult),
        isSuccess: false
      }
    }
    if (!storeResult.data.id) {
      return {
        data: this.formatError(STORE_EMPTY),
        isSuccess: false
      }
    }
    return {
      isSuccess: true,
      data: storeResult.data
    }
  }

  async checkJob(jobId) {
    const result = await this.service.job.index.findMultiple(jobId.map(v => parseInt(v)))
    if (result.code !== SUCCESS_CODE) {
      return {
        data: this.formatError(result),
        isSuccess: false
      }
    }
    if (Array.isArray(result.data) && !result.data.length) return { data: false, isSuccess: true }
    if (Array.isArray(result.data) && result.data.length) return { data: result.data, isSuccess: true }
    return { data: result.data, isSuccess: true }
  }

  async create() {
    const { ctx, service } = this
    const params = ctx.request.body
    const { isSuccess, errorMsg } = await ctx.helper.validate(params, createDescribe)
    if (!isSuccess) {
      return (ctx.body = this.formatError({ data: errorMsg }))
    }
    const storeResult = await this.checkStore(params.storeCode)
    if (!storeResult.isSuccess) return this.formatError(storeResult)
    if (params.jobId && params.jobId.length) {
      const jobResult = await this.checkJob(params.jobId)
      if (!jobResult.isSuccess) return this.formatError(jobResult)
      if (jobResult.data && jobResult.data.length !== params.jobId.length) {
        // 有问题
        return (ctx.body = this.formatError(STAFF_JOBID_ERROR))
      }
    }
    const transactions = await this.ctx.helper.dbTransactions()
    // 连接失败
    if (!transactions.isSuccess) return (ctx.body = this.formatData(transactions))
    const { query, rollback, commit, beginTransaction } = transactions
    const beginTransactionResult = await beginTransaction()
    // 开启事务失败
    if (!beginTransactionResult.isSuccess) return (ctx.body = this.formatData(beginTransactionResult))
    // 插入数据
    const insertData = await service.staff.index.create(params, query)
    if (insertData.code !== SUCCESS_CODE) {
      await rollback()
      return (ctx.body = this.formatData(insertData))
    }
    if (params.jobId.length) {
      // 插入关联表的数据
      const insertRelevanceData = await service.staff.staffJob.create(
        {
          jobId: params.jobId,
          staffId: insertData.data.insertId
        },
        query
      )
      if (insertRelevanceData.code !== SUCCESS_CODE) {
        await rollback()
        return (ctx.body = this.formatData(insertRelevanceData))
      }
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
    const id = Number(ctx.params.id)
    const body = ctx.request.body
    const params = {
      ...body,
      id
    }
    if (!this.checkId(id)) return false
    const { isSuccess, errorMsg } = await ctx.helper.validate(params, updateDescribe)
    if (!isSuccess) {
      return (ctx.body = this.formatError({ data: errorMsg }))
    }
    // 检验门店
    const storeResult = await this.checkStore(params.storeCode)
    if (!storeResult.isSuccess) return this.formatError(storeResult)
    // 检验职位
    if (params.jobId && params.jobId.length) {
      const jobResult = await this.checkJob(params.jobId)
      if (!jobResult.isSuccess) return this.formatError(jobResult)
      if (jobResult.data && jobResult.data.length !== params.jobId.length) {
        // 有问题
        return (ctx.body = this.formatError(STAFF_JOBID_ERROR))
      }
    }
    const transactions = await this.ctx.helper.dbTransactions()
    // 连接失败
    if (!transactions.isSuccess) return (ctx.body = this.formatData(transactions))
    const { query, rollback, commit, beginTransaction } = transactions
    const beginTransactionResult = await beginTransaction()
    // 开启事务失败
    if (!beginTransactionResult.isSuccess) return (ctx.body = this.formatData(beginTransactionResult))
    const updateResult = await service.staff.index.update(
      {
        ...params
      },
      query
    )
    if (updateResult.code !== SUCCESS_CODE) {
      await rollback()
      return (ctx.body = this.formatData(updateResult))
    }
    if (params.jobId) {
      // 移除关联表
      const removeResult = await service.staff.staffJob.destroyByStaffId(id, query)
      if (removeResult.code !== SUCCESS_CODE) {
        await rollback()
        return (ctx.body = this.formatError({ data: removeResult.data }))
      }
      // 更新关联表
      if (params.jobId.length) {
        const insertRelevanceData = await service.staff.staffJob.create(
          {
            jobId: params.jobId,
            staffId: id
          },
          query
        )
        if (insertRelevanceData.code !== SUCCESS_CODE) {
          await rollback()
          return (ctx.body = this.formatData(insertRelevanceData))
        }
      }
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
    const data = await service.staff.index.destroy(id)
    await service.staff.staffJob.destroyByStaffId(id)
    // 移除关联表
    console.log(data)
    ctx.body = this.formatData({
      ...data,
      data: data.code === SUCCESS_CODE ? '删除成功' : data.data
    })
  }

  async index() {
    const { ctx } = this
    const query = ctx.request.query
    const data = await this.service.staff.index.index({
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
    const resultInfo = await this.service.staff.index.find(id)
    ctx.body = this.formatData(resultInfo)
  }
}

module.exports = IndexController
