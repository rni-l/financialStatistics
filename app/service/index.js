const Service = require('egg').Service
const { SUCCESS_CODE } = require('../const/codeType')
const { isDef, checkIsNumber } = require('../utils')

module.exports = class BaseService extends Service {
  // 基础 service 类，封装共用业务逻辑方法

  /**
   * 格式化 mysql 返回的数据
   */
  formatData({ code, data }, isGetData = false) {
    return {
      code,
      data: code === 200 ? (isGetData ? data : '') : data
    }
  }

  /**
   * 处理分页数据
   */
  handlePageData(data, otherData) {
    return {
      ...data,
      data: {
        list: data.data,
        ...otherData
      }
    }
  }

  /**
   * 处理总数值
   */
  handleCountData(countData) {
    return countData.code === SUCCESS_CODE ? countData.data[0].count : 1
  }

  /**
   * 格式化 list 数据，取第一个值，转为 Object 类型
   */
  handleListDataToObject(data) {
    return {
      ...data,
      data: data.code !== SUCCESS_CODE ? data.data : data.data[0] || {}
    }
  }

  /**
   * 分页获取数据 - 格式化
   */
  getPageData({ field = '*', tableName, order = 'id', orderType = 'ASC', whereStr = '', curPage = 1, pageSize = 10 }) {
    let _field = field
    /* eslint-disable valid-typeof */
    if (typeof field === 'Object') {
      // 默认为数组
      _field = field.join(',')
    }
    return `SELECT ${_field} FROM ${tableName} ${whereStr} ORDER BY ${order} ${orderType} LIMIT ${(curPage - 1) * pageSize},${pageSize};`
  }

  /**
   * 插入多条数据
   */
  insertMultiData() {}

  /**
   * 根据入参生成 where 语句
   * 末尾不带 ;
   * @param {Object} obj
   */
  createWhereStr(obj) {
    const arr = Object.keys(obj).reduce((acc, cur) => {
      if (isDef(obj[cur])) return acc
      acc.push(`${cur}=${obj[cur]}`)
      return acc
    }, [])
    if (arr.length) {
      return ' WHERE ' + arr.join(' & ')
    }
    return ''
  }

  /**
   * 根据 Object 生成 create 需要的字符
   * @param {Object} obj
   * @returns {string}
   */
  createFieldAndValueStr(obj) {
    // (name, fields, \`order\`)
    //   VALUES('${name}', ${order})
    let field = '('
    let value = ' VALUES('
    Object.keys(obj).forEach(key => {
      const val = obj[key]
      field += `\`${key}\`, `
      value += checkIsNumber(val) ? val : `'${val}'` + ', '
    })
    field = field.slice(0, field.length - 2) + ')'
    value = value.slice(0, value.length - 2) + ')'
    return field + value
  }

  /**
   * 根据 Object 生成 update 需要的字符
   * @param {Object} obj
   * @returns {string}
   */
  createUpdateStr(obj) {
    const str = Object.keys(obj).reduce((acc, key) => {
      const val = obj[key]
      const _val = checkIsNumber(val) ? val : `'${val}'` + ''
      acc += `\`${key}\`=${_val},`
      return acc
    }, '')
    return str.slice(0, str.length - 1)
  }
}
