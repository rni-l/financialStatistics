const { commonId, stringFunc, status } = require('../common')

exports.id = {
  ...commonId,
  message: '请传入职位的 id'
}

exports.name = {
  ...stringFunc('请传入名称', 64)
}

exports.price = {
  type: 'number',
  required: true,
  message: '请传入金额'
}

exports.openDate = {
  type: 'number',
  required: true,
  message: '请传入开单时间',
  length: 13
}

exports.receiveDate = {
  type: 'number',
  required: false,
  message: '请传入收起时间',
  length: 13
}

exports.staffInfo = {
  required: true,
  validator: (rule, value) => {
    const type = Object.prototype.toString.call(value)
    if (type === '[object, Array]' && value.length) {
      // 检查里面的内容，是否符合
      return !value.every(v => {
        return !!v.staffId && !!v.ratio
      })
    }
    return true
  },
  message: '请传入正确格式的 staffId'
}

exports.status = status
