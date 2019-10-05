const path = require('path')
const CONFIG = require('../private-config')
const ROUTER_CONFIG = require('./router')

const mysql = {
  host: CONFIG.mysql.host || '127.0.0.1',
  user: CONFIG.mysql.user || 'root',
  password: CONFIG.mysql.password || '123123',
  database: CONFIG.mysql.database,
  port: CONFIG.mysql.port || 3306,
  dateStrings: true // 将时间转换为字符串
}

const qiniu = {
  ...CONFIG.qiniu
}

module.exports = appInfo => {
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1536543203799_4028'

  config.static = {
    prefix: '/'
  }

  config.session = {
    key: 'CMS_SESSION',
    maxAge: 24 * 3600 * 1000 * 3,
    httpOnly: true,
    encrypt: true
  }

  // add your config here
  config.middleware = ['auth']

  config.auth = {
    ignore: ROUTER_CONFIG.ignoreFunc
  }

  config.mysql = mysql

  config.cluster = {
    listen: {
      port: CONFIG.port || 7001
    }
  }

  config.security = {
    domainWhiteList: [],
    csrf: {
      // headerName: 'x-csrf-token' // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      enable: false
    }
  }

  exports.multipart = {
    mode: 'file'
  }

  config.view = {
    defaultExt: '.html',
    root: path.join(__dirname, '../static'),
    mapping: {
      '.ejs': 'ejs',
      '.html': 'ejs'
    }
  }

  config.redis = {
    client: {
      ...CONFIG.redis
    }
  }

  config.qiniu = qiniu

  config.wechatMiniApp = CONFIG.wechatMiniApp
  config.wechat = CONFIG.wechat

  config.logger = {
    dir: path.join(__dirname, '../logs/egg-cli'),
    level: 'DEBUG',
    allowDebugAtProd: 'true',
    consoleLevel: 'DEBUG'
  }

  config.logrotator = {
    filesRotateByHour: [], // list of files that will be rotated by hour
    hourDelimiter: '-', // rotate the file by hour use specified delimiter
    filesRotateBySize: [], // list of files that will be rotated by size
    maxFileSize: 50 * 1024 * 1024, // Max file size to judge if any file need rotate
    maxFiles: 10, // pieces rotate by size
    rotateDuration: 60000, // time interval to judge if any file need rotate
    maxDays: 31 // keep max days log files, default is `31`. Set `0` to keep all logs
  }

  // 自定义日志
  config.customLogger = {
    crawlerLogger: {
      file: path.join(appInfo.root, 'logs/imgs.log')
    }
  }

  // 计算配置
  config.base = {
    platformRatio: 0.15, // 平台比例
    newBonusRatio: 0.52 // 新的，员工抽佣比例
  }

  return config
}
