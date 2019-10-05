const Service = require('../index')
const { SUCCESS_CODE } = require('../../const/codeType')
const moment = require('moment')

module.exports = class StoreService extends Service {
  async getStaff() {
    const sql = `SELECT
      s.id, s.name, s.store_code as storeCode, s.register_time as registerTime,
      s.bonus_ratio as bonusRatio, s.is_ignore_platform as isIgnorePlatform,
      t.address, t.remark, t.id as storeId, t.name as storeName,
      j.code as jobCode, j.name as jobName, j.commission_ratio as commissionRatio, j.id as jobId
    FROM
      staff as s
      LEFT JOIN store as t ON s.store_code = t.code
      LEFT JOIN job as j ON j.id in (SELECT job_id FROM staff__job WHERE staff_id = s.id);`
    const data = await this.ctx.helper.dbQuery(sql)
    if (data.code !== SUCCESS_CODE) return this.formatData(data, true)
    return this.formatData(
      {
        code: 200,
        data: data.data.reduce((acc, cur) => {
          const findObj = acc.find(v => v.id === cur.id)
          if (!findObj) {
            acc.push({
              id: cur.id,
              name: cur.name,
              storeCode: cur.storeCode,
              registerTime: cur.registerTime,
              address: cur.address,
              remark: cur.remark,
              storeId: cur.storeId,
              bonusRatio: cur.bonusRatio,
              isIgnorePlatform: cur.isIgnorePlatform,
              jobs: []
            })
          }
          if (cur.jobId) {
            const obj = {
              jobId: cur.jobId,
              jobCode: cur.jobCode,
              jobName: cur.jobName,
              commissionRatio: cur.commissionRatio
            }
            if (!findObj) {
              console.log(acc)
              acc[acc.length - 1].jobs.push(obj)
            } else {
              findObj.jobs.push(obj)
            }
          }
          return acc
        }, [])
      },
      true
    )
  }

  async getBill(startDate, endDate) {
    let sql = `SELECT
      b.id, b.name, b.price, b.open_date as open_date, b.receive_date as receiveDate, b.status,
      s.id as staffId,
      bs.ratio
      FROM bill as b
      LEFT JOIN staff as s ON s.id in (SELECT staff_id FROM bill__staff as bs WHERE bs.bill_id = b.id)
      LEFT JOIN bill__staff as bs ON bs.bill_id = b.id AND s.id = bs.staff_id
    `
    if (startDate && endDate) {
      sql += `WHERE receive_date >= ${startDate} AND receive_date <= ${endDate}`
    }
    const data = await this.ctx.helper.dbQuery(sql)
    if (data.code !== SUCCESS_CODE) return this.formatData(data, true)
    return this.formatData(
      {
        code: 200,
        data: data.data.reduce((acc, cur) => {
          const findObj = acc.find(v => v.id === cur.id)
          if (!findObj) {
            acc.push({
              id: cur.id,
              name: cur.name,
              price: cur.price,
              openDate: cur.openDate,
              openDateDesc: moment(cur.openDate).format('YYYY-MM-DD HH:mm:ss'),
              receiveDate: cur.receiveDate,
              receiveDateDesc: moment(cur.receiveDate).format('YYYY-MM-DD HH:mm:ss'),
              status: cur.status,
              staffs: []
            })
          }
          if (cur.staffId) {
            const obj = {
              staffId: cur.staffId,
              staffRatio: cur.ratio
            }
            if (!findObj) {
              console.log(acc)
              acc[acc.length - 1].staffs.push(obj)
            } else {
              findObj.staffs.push(obj)
            }
          }
          return acc
        }, [])
      },
      true
    )
  }
}
