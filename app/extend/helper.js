const { getPool } = require('../../config/mysql')
const crypto = require('crypto')
const { validate } = require('../utils/validateFunc')

function handleData({ data, err }) {
  if (err && typeof err === 'object') {
    delete err.sql
  }
  return Object.assign(
    {
      data: err ? (typeof err === 'string' ? err : err.sqlMessage) : data,
      code: err ? err.errno : 200
    },
    err ? { errData: err } : {}
  )
}

module.exports = {
  /**
   * 数据库请求封装
   */
  dbQuery(sql) {
    return new Promise(resolve => {
      getPool().getConnection((err, connection) => {
        if (err) {
          // mysqlLogger.error(err)
          return resolve(handleData({ err }))
        }
        connection.query(sql, (err, data) => {
          console.log('sql:', sql)
          connection.release()
          if (err) {
            // mysqlLogger.error(err)
            return resolve(handleData({ err }))
          }
          console.log('data result:', data)
          resolve(handleData({ data }))
        })
      })
    })
  },

  /**
   * 事务封装
   */
  dbTransactions() {
    return new Promise(resolve => {
      getPool().getConnection((err, connection) => {
        if (err) {
          // mysqlLogger.error(err)
          return resolve(handleData({ err }))
        }
        resolve({
          beginTransaction: () => {
            return new Promise(resolve => {
              connection.beginTransaction(err => {
                if (err) {
                  connection.release()
                  return resolve({ isSuccess: false, data: err })
                }
                return resolve({ isSuccess: true, data: '' })
              })
            })
          },
          query: sql => {
            console.log('sql:', sql)
            return new Promise(resolve => {
              connection.query(sql, (err, data) => {
                if (err) {
                  connection.release()
                  return resolve(handleData({ err }))
                }
                console.log('data result:', data)
                resolve(handleData({ data }))
              })
            })
          },
          rollback: () => {
            return new Promise(resolve => {
              connection.rollback(err => {
                try {
                  connection.release()
                } catch (error) {
                  console.log('rollback error')
                }
                console.log('resolve')
                resolve(err)
              })
            })
          },
          commit: () => {
            return new Promise(resolve => {
              connection.commit(err => {
                connection.release()
                if (err) {
                  return resolve({ isSuccess: false, data: err })
                }
                return resolve({ isSuccess: true, data: '' })
              })
            })
          },
          connection,
          isSuccess: true
        })
      })
    })
  },

  encryption(value) {
    const md5 = crypto.createHash('md5')
    md5.update(value)
    return md5.digest('hex')
  },

  async validate(value, describe, opts) {
    const result = await validate(value, describe, opts)
    return result
  }
}
