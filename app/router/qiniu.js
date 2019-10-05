const { QINIU } = require('./types')

module.exports = ({ router, controller }) => {
  const sub = router.namespace(QINIU)
  sub.get('getQiniuToken', '/getToken', controller.qiniu.index.getToken)
}
