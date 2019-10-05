const { STAFF } = require('./types')

module.exports = ({ router, controller }) => {
  const sub = router.namespace(STAFF)
  sub.resources('staff', '', controller.staff.index)
}
