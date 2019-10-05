// const { commonId } = require('../common')

exports.startDate = {
  type: 'number',
  required: false,
  message: '请传入开始时间',
  length: 13
}

exports.endDate = {
  type: 'number',
  required: false,
  message: '请传入结束时间',
  length: 13
}
