const Service = require('../index')
const TABLE_NAME = 'staff'

module.exports = class StoreService extends Service {
  async create({ name, storeCode, bonusRatio = 0, isIgnorePlatform = 0 }, query) {
    const sql = `INSERT INTO ${TABLE_NAME}(name, store_code, bonus_ratio, is_ignore_platform)
      VALUES('${name}', '${storeCode}', ${bonusRatio}, ${isIgnorePlatform});`
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
      tableName: `${TABLE_NAME} as s LEFT JOIN store as t`,
      whereStr: 'ON s.store_code = t.code',
      field: `s.id, s.name, s.store_code as storeCode, s.register_time as registerTime,
        s.bonus_ratio as bonusRatio, s.is_ignore_platform as isIgnorePlatform,
        t.\`id\` as storeId, t.\`name\` as storeName`
    })
    let countSql = `SELECT COUNT(*) AS count FROM ${TABLE_NAME} `
    const countData = await this.ctx.helper.dbQuery(countSql)
    const count = this.handleCountData(countData)
    return this.handlePageData(await this.ctx.helper.dbQuery(sql), { count, curPage, pageSize })
  }

  async update({ name, storeCode, bonusRatio = 0, isIgnorePlatform = 0, id }, query) {
    const sql = `UPDATE ${TABLE_NAME} SET name='${name}', store_code='${storeCode}',
      bonus_ratio=${bonusRatio}, is_ignore_platform=${isIgnorePlatform}
      WHERE id = ${id};`
    let result
    if (query) {
      result = await query(sql)
    } else {
      result = await this.ctx.helper.dbQuery(sql)
    }
    return this.formatData(result, true)
  }

  async destroy(id) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE id = ${id}`
    return this.formatData(await this.ctx.helper.dbQuery(sql))
  }

  async find(id) {
    const sql = `SELECT
      s.id, s.name, s.store_code as storeCode, s.register_time as registerTime,
      s.bonus_ratio as bonusRatio, s.is_ignore_platform as isIgnorePlatform,
      t.\`address\`, t.remark, t.\`id\` as storeId, t.\`name\` as storeName,
      j.code as jobCode, j.name as jobName, j.commission_ratio as commissionRatio, j.id as jobId
    FROM
      ${TABLE_NAME} as s
      LEFT JOIN store as t ON s.store_code = t.code
      LEFT JOIN job as j ON j.id in (SELECT job_id FROM staff__job WHERE staff_id = s.id)
    WHERE s.id = ${id}`
    const data = await this.ctx.helper.dbQuery(sql)
    return this.formatData(
      !data.data
        ? data
        : {
          ...data,
          data: data.data.reduce((acc, cur) => {
            if (!acc.id) {
              acc = {
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
              }
            }
            if (cur.jobId) {
              acc.jobs.push({
                id: cur.jobId,
                code: cur.jobCode,
                name: cur.jobName,
                commissionRatio: cur.commissionRatio
              })
            }
            return acc
          }, {})
        },
      true
    )
  }
}
