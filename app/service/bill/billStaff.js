const Service = require('../index')
const TABLE_NAME = 'bill__staff'

module.exports = class billStaffService extends Service {
  async create({ billId, staffInfo }, query) {
    let sql = `INSERT INTO ${TABLE_NAME}(staff_id, bill_id, ratio, staff_ratio)
      VALUES`
    let jobs = staffInfo.reduce((acc, cur, curIndex) => {
      acc += `(${cur.staffId}, ${billId}, ${cur.ratio}, ${cur.staffRatio || null})`
      return acc + (curIndex < staffInfo.length - 1 ? ',' : ';')
    }, '')
    sql += jobs
    let result
    if (query) {
      result = await query(sql)
    } else {
      result = await this.ctx.helper.dbQuery(sql)
    }
    return this.formatData(result, true)
  }

  async destroyByBillId(id, query) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE bill_id = ${id};`
    let result
    if (query) {
      result = await query(sql)
    } else {
      result = await this.ctx.helper.dbQuery(sql)
    }
    return this.formatData(result, true)
  }
}
