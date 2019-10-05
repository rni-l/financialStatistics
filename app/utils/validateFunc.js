const { phone, email } = require('./regexp')
const Schema = require('async-validator').default

exports.checkPhone = value => {
  if (phone.test(value)) return false
  return '请输入正确的手机号'
}

exports.checkEmail = value => {
  if (email.test(value)) return false
  return '请输入正确的邮箱'
}
/**
 * 检验值
 *
 * @param {Object} value 需要检验的值
 * @param {Object} descriptor 检验规则
 * @returns {Promise<Object>}
 */
exports.validate = (value, descriptor, opts = {}) => {
  const Validator = new Schema(descriptor)
  return new Promise(resolve => {
    Validator.validate(value, { first: true, ...opts }, (errors, fields) => {
      resolve({
        isSuccess: !errors,
        errorMsg: errors ? errors[0].message : '',
        errors,
        fields,
        filedKeys: fields ? Object.keys(fields) : []
      })
    })
  }).catch(err => {
    console.log('validate err:', err)
    return {
      isSuccess: false
    }
  })
}
