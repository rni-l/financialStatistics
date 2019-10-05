const { commonId, code, stringFunc } = require('../common')

exports.id = {
  ...commonId,
  message: '请传入职位的 id'
}

exports.code = {
  ...code,
  message: '请传入职位的 code'
}

exports.name = {
  ...stringFunc('职位的 name', 64)
}

exports.commissionRatio = {
  type: 'number',
  required: true,
  message: '请传入职位的 commissionRatio',
  min: 0,
  max: 1
}

exports.salary = {
  type: 'number',
  required: true,
  message: '请传入职位的 salary'
}

exports.bonusRatio = {
  type: 'number',
  required: true,
  message: '请传入职位的 bonusRatio',
  min: 0,
  max: 1
}
