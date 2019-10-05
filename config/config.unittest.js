const path = require('path')
const getSwagger = require('./swagger')

module.exports = appInfo => {
  const config = exports = {}
  config.static = {
    prefix: '/public/',
    dir: [path.join(appInfo.root, './public/swagger-ui')]
  }

  config.swagger = getSwagger(appInfo)

  config.port = 7002

  return config
}
