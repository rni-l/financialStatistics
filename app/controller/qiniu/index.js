const BaseController = require('../index')
const qiniu = require('qiniu')
// const Validate = require('easy-validate-form')

module.exports = class QiniuController extends BaseController {
  /**
   * @swagger
   * /getToken/:
   *   get:
   *     tags:
   *       - qiniu
   *     description: 获取 Product
   *     parameters:
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: 成功
   *         schema:
   *           $ref: '#/definitions/User'
   *       400:
   *         description: 失败
   *         schema:
   *           properties:
   *             error:
   *               type: string
   *               description: error desc
   *               required: true
   */
  async getToken() {
    const { ak, sk, bucket, clientDomain, bucketUrl } = this.ctx.app.config.qiniu
    const mac = new qiniu.auth.digest.Mac(ak, sk)
    const uploadToken = (new qiniu.rs.PutPolicy({
      scope: bucket,
      expires: 7200
    })).uploadToken(mac)
    this.ctx.body = this.formatData({
      data: {
        token: uploadToken,
        action: clientDomain,
        bucketUrl
      }
    })
  }
}
