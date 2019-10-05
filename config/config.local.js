// const path = require('path')
const getSwagger = require('./swagger')

module.exports = appInfo => {
  const config = exports = {}

  config.swagger = getSwagger(appInfo)

  config.port = 7002

  return config
}
