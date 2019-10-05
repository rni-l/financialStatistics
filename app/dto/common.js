exports.commonId = {
  type: 'number',
  required: true,
  max: 64,
  min: 1
}

exports.code = {
  type: 'string',
  required: true,
  min: 1,
  max: 12
}

exports.status = {
  type: 'number',
  required: false,
  length: 1,
  message: '请传入正确格式的 status'
}

exports.stringFunc = (message, length = false, required = true) => {
  const obj = {
    type: 'string',
    message,
    required
  }
  if (length) {
    obj.length = length
  }
  return obj
}
