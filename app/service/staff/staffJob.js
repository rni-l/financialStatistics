const Service = require('../index')
const TABLE_NAME = 'staff__job'

module.exports = class staffJobService extends Service {
  async create({ jobId, staffId }, query) {
    let sql = `INSERT INTO ${TABLE_NAME}(job_id, staff_id)
      VALUES`
    let jobs = jobId.reduce((acc, cur, curIndex) => {
      acc += `(${cur}, ${staffId})`
      return acc + (curIndex < jobId.length - 1 ? ',' : ';')
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

  async destroyByStaffId(id, query) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE staff_id = ${id};`
    let result
    if (query) {
      result = await query(sql)
    } else {
      result = await this.ctx.helper.dbQuery(sql)
    }
    return this.formatData(result, true)
  }
}
