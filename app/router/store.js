const { STORE } = require('./types')

module.exports = ({ router, controller }) => {
  const sub = router.namespace(STORE)
  sub.resources('store', '', controller.store.index)
}
