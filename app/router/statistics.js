const { STATISTICS } = require('./types')

module.exports = ({ router, controller }) => {
  const sub = router.namespace(STATISTICS)
  sub.get('statistics', '/staff/salary', controller.statistics.index.getSalary)
  sub.get('statistics', '/excel', controller.statistics.index.createExcel)
}
