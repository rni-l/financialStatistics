const { commonId, code, stringFunc } = require('../common')

exports.id = {
  ...commonId,
  message: '请传入员工的 id'
}

exports.name = {
  ...stringFunc('请传入员工的 name', 64)
}

exports.storeCode = code

exports.jobId = {
  required: false,
  validator: (rule, value) => {
    const type = Object.prototype.toString.call(value)
    if (type === '[object, Array]') return false
    return true
  },
  message: '请传入正确格式的 jobId'
}

exports.bonusRatio = {
  type: 'number',
  required: false,
  message: '请传入正确格式的 bonusRatio'
}

exports.isIgnorePlatform = {
  type: 'number',
  required: false,
  message: '请传入正确格式的 isIgnorePlatform',
  min: 0,
  max: 1
}
