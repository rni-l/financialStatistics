const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')
const CONFIG = require('../private-config')

module.exports = appInfo => {
  return swaggerJSDoc({
    enable: true,
    swaggerDefinition: {
      info: {
        // API informations (required)
        title: 'cms', // Title (required)
        version: '0.0.1', // Version (required)
        description: 'node-egg API', // Description (optional)
        contact: {
          email: '15625979610@163.com'
        }
      },
      host: `http://localhost:${CONFIG.port}`,
      basePath: '/api',
      schemes: ['http', 'ws']
    },
    apis: [path.resolve(appInfo.root, 'public/swagger-ui-api/*'), path.resolve(appInfo.root, 'app/controller/*.js'), path.resolve(appInfo.root, 'app/controller/*/*.js'), path.resolve(appInfo.root, 'app/router/*')]
  })
}
