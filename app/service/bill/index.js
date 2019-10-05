const Service = require('../index')
const TABLE_NAME = 'bill'

module.exports = class BillService extends Service {
  async create({ name, price, openDate, receiveDate }, query) {
    const sql = `INSERT INTO ${TABLE_NAME}(name, price, open_date, receive_date)
      VALUES('${name}', ${price}, ${openDate}, ${receiveDate});`
    let result
    if (query) {
      result = await query(sql)
    } else {
      result = await this.ctx.helper.dbQuery(sql)
    }
    return this.formatData(result, true)
  }

  async index({ curPage = 1, pageSize = 10, order, orderType }) {
    let sql = this.getPageData({
      curPage,
      pageSize,
      order,
      orderType,
      tableName: TABLE_NAME,
      field: 'id, name, price, open_date as open_date, receive_date as receiveDate, status'
    })
    let countSql = `SELECT COUNT(*) AS count FROM ${TABLE_NAME} `
    const countData = await this.ctx.helper.dbQuery(countSql)
    const count = this.handleCountData(countData)
    return this.handlePageData(await this.ctx.helper.dbQuery(sql), { count, curPage, pageSize })
  }

  async update({ name, price, openDate, receiveDate, status = 0, id }) {
    const sql = `UPDATE ${TABLE_NAME} SET name='${name}', price=${price}, open_date=${openDate}, receive_date=${receiveDate}, status=${status}
      WHERE id = ${id};`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }

  async destroy(id) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE id = ${id}`
    return this.formatData(await this.ctx.helper.dbQuery(sql))
  }

  async find(id) {
    const sql = `SELECT
      id, name, price, open_date as openDate, receive_date as receiveDate, status
    FROM ${TABLE_NAME} WHERE ${id} = '${id}'`
    return this.handleListDataToObject(await this.ctx.helper.dbQuery(sql))
  }
}
