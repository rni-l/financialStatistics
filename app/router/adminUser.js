const { ADMIN_USER } = require('./types')

module.exports = ({ router, controller }) => {
  const sub = router.namespace(ADMIN_USER)
  sub.post('adminUser', '/login', controller.adminUser.index.login)
  sub.get('adminUser', '/logout', controller.adminUser.index.logout)
  sub.resources('adminUser', '', controller.adminUser.index)
}
