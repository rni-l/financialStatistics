const Controller = require('egg').Controller

/**
 * 默认数据格式：
 * {
 *   code: Number
 *   data: Object|Array|String
 * }
 */

module.exports = class BaseController extends Controller {
  // 基础 controller 类，封装共用业务逻辑方法
  formatError(errorData) {
    return {
      code: errorData.code || 500,
      data: errorData.data
    }
  }

  formatData(data) {
    return {
      code: 200,
      ...data
    }
  }
}
