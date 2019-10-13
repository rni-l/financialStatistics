const Service = require('../index')
const TABLE_NAME = 'job'

module.exports = class StoreService extends Service {
  async create({ name, code, commissionRatio, salary, bonusRatio = 0 }) {
    const sql = `INSERT INTO ${TABLE_NAME}(name, code, commission_ratio, salary, bonus_ratio)
      VALUES('${name}', '${code}', ${commissionRatio}, ${salary}, ${bonusRatio});`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }

  async index({ curPage = 1, pageSize = 10, order, orderType }) {
    let sql = this.getPageData({
      curPage,
      pageSize,
      order,
      orderType,
      tableName: TABLE_NAME,
      field: 'id, name, code, salary, commission_ratio as commissionRatio, bonus_ratio as bonusRatio, created_time as createdTime, updated_time as updatedTime'
    })
    let countSql = `SELECT COUNT(*) AS count FROM ${TABLE_NAME} `
    const countData = await this.ctx.helper.dbQuery(countSql)
    const count = this.handleCountData(countData)
    return this.handlePageData(await this.ctx.helper.dbQuery(sql), { count, curPage, pageSize })
  }

  async update({ name, code, commissionRatio, salary, bonusRatio = 0, id }) {
    const sql = `UPDATE ${TABLE_NAME} SET name='${name}', code='${code}', commission_ratio=${commissionRatio}, salary=${salary}, bonus_ratio=${bonusRatio}
      WHERE id = ${id};`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }

  async destroy(id) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE id = ${id}`
    return this.formatData(await this.ctx.helper.dbQuery(sql))
  }

  async find(id) {
    const sql = `SELECT
      id, name, code, salary, commission_ratio as commissionRatio, bonus_ratio as bonusRatio, created_time as createdTime, updated_time as updatedTime
    FROM ${TABLE_NAME} WHERE ${id} = '${id}'`
    return this.handleListDataToObject(await this.ctx.helper.dbQuery(sql))
  }

  async findMultiple(ids) {
    const sql = `SELECT
      id, name, code, salary, commission_ratio as commissionRatio, bonus_ratio as bonusRatio, created_time as createdTime, updated_time as updatedTime
    FROM ${TABLE_NAME} WHERE id in (${ids.join(',')});`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }
}
