const { BILL } = require('./types')

module.exports = ({ router, controller }) => {
  const sub = router.namespace(BILL)
  sub.resources('bill', '', controller.bill.index)
  sub.get('bill', '/updateStatus/:id', controller.bill.index.updateStatus)
}
