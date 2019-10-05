const { commonId, status, stringFunc } = require('../common')

exports.id = {
  ...commonId,
  message: '请传入 adminUser 的 id'
}

exports.status = status

exports.name = {
  ...stringFunc('请传入 adminUser 的 name', 32)
}

exports.password = [
  stringFunc('请传入密码'),
  {
    type: 'number',
    min: 6,
    max: 32,
    validator: (rule, value) => value.length >= 6 && value.length <= 32,
    message: '请输入密码 6 - 32 位'
  }
]
