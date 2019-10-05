const Service = require('../index')
const TABLE_NAME = 'admin_user'

module.exports = class UserService extends Service {
  async login({ name, password }) {
    const sql = `SELECT id, name, created_time as createdTime, 'stauts'
      FROM ${TABLE_NAME} WHERE name='${name}' and password='${password}';`
    return this.handleListDataToObject(await this.ctx.helper.dbQuery(sql))
  }

  async register({ name, password, status }) {
    const sql = `INSERT INTO ${TABLE_NAME}(name, password, status)
      VALUES('${name}', '${password}', ${status || 0});`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }

  async update({ name, status = 0, id }) {
    const sql = `UPDATE ${TABLE_NAME} SET name='${name}',
      \`status\`=${status} WHERE id = ${id};`
    return this.formatData(await this.ctx.helper.dbQuery(sql), true)
  }
}
