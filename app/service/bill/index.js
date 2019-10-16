const Service = require('../index')
const { SUCCESS_CODE } = require('../../const/codeType')
const TABLE_NAME = 'bill'

module.exports = class BillService extends Service {
  async create({ name, price, openDate, receiveDate = 0 }, query) {
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
      field: 'id, name, price, open_date as openDate, receive_date as receiveDate, status'
    })
    let countSql = `SELECT COUNT(*) AS count FROM ${TABLE_NAME} `
    const countData = await this.ctx.helper.dbQuery(countSql)
    const count = this.handleCountData(countData)
    return this.handlePageData(await this.ctx.helper.dbQuery(sql), { count, curPage, pageSize })
  }

  async update({ name, price, openDate, receiveDate = 0, status = 0, id }) {
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
      b.id, b.name, b.price, b.open_date as openDate,
      b.receive_date as receiveDate, b.status, s.name as staffName,
      s.id as staffId, bs.ratio
    FROM bill as b left join
    bill__staff as bs ON bs.bill_id = 20 left join
    staff as s ON s.id = bs.staff_id
    WHERE b.id = ${id}`
    const data = await this.ctx.helper.dbQuery(sql)
    if (data.code !== SUCCESS_CODE) return this.formatData(data, true)
    return this.handleListDataToObject(
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
              receiveDate: cur.receiveDate,
              status: cur.status,
              staffs: []
            })
          }
          if (cur.staffId) {
            const obj = {
              id: cur.staffId,
              ratio: cur.ratio,
              name: cur.staffName
            }
            if (!findObj) {
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

  async updateStatus(id) {
    const sql = `UPDATE ${TABLE_NAME} SET receive_date=${Date.now()}, status=1
      WHERE id = ${id};`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }
}
