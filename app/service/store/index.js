const Service = require('../index')
const TABLE_NAME = 'store'

module.exports = class StoreService extends Service {
  async create({ name, code, address = '', remark = '' }) {
    const sql = `INSERT INTO ${TABLE_NAME}(name, code, address, remark)
      VALUES('${name}', '${code}', '${address}', '${remark}');`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }

  async index({ curPage = 1, pageSize = 10, order, orderType }) {
    let sql = this.getPageData({
      curPage,
      pageSize,
      order,
      orderType,
      tableName: TABLE_NAME,
      field: ['id', 'name', 'code', 'address', 'remark']
    })
    let countSql = `SELECT COUNT(*) AS count FROM ${TABLE_NAME} `
    const countData = await this.ctx.helper.dbQuery(countSql)
    const count = this.handleCountData(countData)
    return this.handlePageData(await this.ctx.helper.dbQuery(sql), { count, curPage, pageSize })
  }

  async update({ name, code, address = '', remark = '', id }) {
    const sql = `UPDATE ${TABLE_NAME} SET name='${name}', code='${code}',
      address='${address}', remark='${remark}' WHERE id = ${id};`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }

  async destroy(id) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE id = ${id}`
    return this.formatData(await this.ctx.helper.dbQuery(sql))
  }

  async find(val, key = 'id') {
    const sql = `SELECT
      id, name, code, address, remark
    FROM ${TABLE_NAME} WHERE ${key} = '${val}'`
    return this.handleListDataToObject(await this.ctx.helper.dbQuery(sql))
  }
}
