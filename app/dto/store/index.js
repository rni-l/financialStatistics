const { commonId, code, stringFunc } = require('../common')

exports.id = {
  ...commonId,
  message: '请传入 store 的 id'
}

exports.code = {
  ...code,
  message: '请传入 store 的 code'
}

exports.name = {
  ...stringFunc('store 的 name', 64)
}

exports.address = {
  ...stringFunc('store 的 address', 256, false)
}

exports.remark = {
  ...stringFunc('store 的 remark', false, false)
}
