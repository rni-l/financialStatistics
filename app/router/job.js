const { JOB } = require('./types')

module.exports = ({ router, controller }) => {
  const sub = router.namespace(JOB)
  sub.resources('job', '', controller.job.index)
}
