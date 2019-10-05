const Mock = require('mockjs')
const crypto = require('crypto')

module.exports = (jsapi_ticket, url) => {
  const timestamp = Math.floor(new Date().getTime() / 1000)
  const noncestr = Mock.mock({ 'string|16': '' }).string
  let result = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
  const sha1 = crypto.createHash('sha1')
  sha1.update(result, 'utf8')
  result = sha1.digest('hex')
  return {
    timestamp, // 必填，生成签名的时间戳
    nonceStr: noncestr, // 必填，生成签名的随机串
    signature: result
  }
}
