'use strict'

const Excel = require('exceljs')
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const BaseController = require('../index')
const { startDate, endDate } = require('../../dto/statistics')
const { SUCCESS_CODE, ID_EMPTY } = require('../../const/codeType')
const { formatNumber } = require('../../utils')

const salaryDescribe = {
  startDate,
  endDate
}

class IndexController extends BaseController {
  async getSalary() {
    const { ctx, service } = this
    const { startDate, endDate } = ctx.request.query
    let _params = {}
    if (startDate && endDate) {
      _params = {
        startDate: startDate === 'undefined' ? undefined : Number(startDate),
        endDate: endDate === 'undefined' ? undefined : Number(endDate)
      }
    }
    const { isSuccess, errorMsg } = await ctx.helper.validate(_params, salaryDescribe)
    if (!isSuccess) {
      return (ctx.body = this.formatError({ data: errorMsg }))
    }
    let results = []
    try {
      results = await Promise.all([await service.statistics.index.getStaff(), await service.statistics.index.getBill(_params.startDate, _params.endDate)])
    } catch (error) {
      console.log('promise all error:', error)
      ctx.body = this.formatError(error)
    }
    const isOk = results.every(v => v.code === SUCCESS_CODE)
    if (!isOk) {
      return (ctx.body = this.formatError({ data: '出错了' }))
    }
    const data = await this.computeData({
      staffs: results[0].data,
      bills: results[1].data
    })
    let name = '工资表'
    if (_params.startDate && _params.endDate) {
      name = `${moment(_params.startDate).format('YYYY-MM-DD')}至${moment(_params.endDate).format('YYYY-MM-DD')}的工资表`
    } else {
      name = '总工资表'
    }
    const filename = await this.createExcel(data, name)
    this.ctx.attachment(filename)
    this.ctx.set('Content-Type', 'application/octet-stream')
    this.ctx.body = fs.createReadStream(path.resolve(this.app.config.static.dir, filename))
  }

  async computeData({ staffs, bills }) {
    const { platformRatio, newBonusRatio } = this.app.config.base
    const data = staffs.map(v => ({
      ...v,
      bills: []
    }))
    bills.forEach(bill => {
      if (bill.status !== 1) return false
      bill.staffs.forEach(({ staffId, staffRatio, staffBillRatio }) => {
        const staff = data.find(v => v.id === staffId)
        if (!staff) return false
        const remainingPrice = formatNumber(
          bill.price *
            // 如果 isIgnorePlatform === 1 ，不需要扣除平台费
            (staff.isIgnorePlatform === 1 ? 1 : 1 - platformRatio)
        )
        const _ratio = staffRatio
        // 佣金金额
        const bonusPrice = formatNumber(
          bill.price *
            // 如果 isIgnorePlatform === 1 ，不需要扣除平台费
            (staff.isIgnorePlatform === 1 ? 1 : 1 - platformRatio) *
            _ratio
        )
        // console.log(
        //   'bill:',
        //   bill.price,
        //   staff.isIgnorePlatform === 1 ? 1 : 1 - platformRatio,
        //   staffRatio,
        //   bill.price,
        //   bill.price * (staff.isIgnorePlatform === 1 ? 1 : 1 - platformRatio),
        //   // 如果 isIgnorePlatform === 1 ，不需要扣除平台费
        //   bill.price * (staff.isIgnorePlatform === 1 ? 1 : 1 - platformRatio) * staffRatio
        // )
        staff.bills.push({
          address: bill.name,
          billPrice: bill.price,
          ratio: _ratio,
          remainingPrice,
          bonusPrice,
          staffReceivePrice: formatNumber(bill.price * (staff.isIgnorePlatform === 1 ? 1 : 1 - platformRatio) * _ratio *
            // 先判断是否有该员工在该订单的比率
            // 再判断该员工设置的比率
            // 再获取默认比率
            (staffBillRatio || staff.bonusRatio || newBonusRatio))
        })
      })
    })
    return {
      staff: data,
      bills
    }
  }

  async createExcel({ staff, bills }, name) {
    const workbook = new Excel.Workbook()
    workbook.creator = 'lujieqi'
    workbook.views = {
      x: 0,
      y: 0,
      width: 5000,
      height: 30000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible'
    }
    const worksheet = workbook.addWorksheet(name, { views: [{ xSplit: 1, ySplit: 1 }] })
    worksheet.horizontalCentered = true
    worksheet.verticalCentered = true
    const aColumn = worksheet.getColumn('A')
    const bColumn = worksheet.getColumn('B')
    const cColumn = worksheet.getColumn('C')
    const dColumn = worksheet.getColumn('D')
    const eColumn = worksheet.getColumn('E')
    const fColumn = worksheet.getColumn('F')
    const gColumn = worksheet.getColumn('G')
    const hColumn = worksheet.getColumn('H')
    const iColumn = worksheet.getColumn('I')
    const jColumn = worksheet.getColumn('J')
    const kColumn = worksheet.getColumn('K')
    const lColumn = worksheet.getColumn('L')
    const mColumn = worksheet.getColumn('M')
    const nColumn = worksheet.getColumn('N')
    aColumn.width = 20
    bColumn.width = 40
    cColumn.width = 12
    dColumn.width = 30
    eColumn.width = 12
    fColumn.width = 12
    gColumn.width = 12
    hColumn.width = 12
    iColumn.width = 20
    jColumn.width = 15
    kColumn.width = 12
    lColumn.width = 15
    mColumn.width = 20
    nColumn.width = 20
    var rows = [
      [name],
      ['姓名', '当月实收', '', '', '', '', '', '', '', '实际应付提成'],
      ['', '地址', '已收佣金', '扣除平台费及经费后佣金', '分成比例', '佣金金额', '提成比例', '小计', '经理额外提成', '实际应付提成', '合计', '签名确认', '备注']
    ]
    worksheet.addRows(rows)
    worksheet.mergeCells('A1:M1')
    worksheet.mergeCells('A2:A3')
    worksheet.mergeCells('B2:I2')
    worksheet.mergeCells('J2:K2')
    await this.writeSheet(worksheet, staff, bills)
    worksheet.eachRow(row => {
      row.alignment = { vertical: true, horizontal: 'center' }
    })
    const filename = `${name}${Date.now()}.xlsx`
    const fpath = path.join(__dirname, '../../public/' + filename)
    await workbook.xlsx.writeFile(fpath)
    return filename
  }

  async writeSheet(worksheet, staffs, bills) {
    const { newBonusRatio } = this.app.config.base
    const rows = []
    staffs.forEach(staff => {
      if (!staff.bills.length) return false
      staff.bills.forEach((bill, billIndex) => {
        const row = [
          billIndex === 0 ? staff.name : '',
          bill.address,
          bill.billPrice,
          bill.remainingPrice,
          Math.round(bill.ratio * 100) + '%',
          bill.bonusPrice,
          Math.round((staff.bonusRatio || newBonusRatio) * 100) + '%',
          bill.staffReceivePrice,
          '',
          bill.staffReceivePrice,
          '',
          '',
          ''
        ]
        rows.push(row)
      })
      rows.push([])
    })
    worksheet.addRows(rows)
  }
}

module.exports = IndexController
