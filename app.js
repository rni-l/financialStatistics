const MYSQL = require('./config/mysql')
// const crawler = require('./app/plugins/crawler/index')

class AppBootHook {
  constructor(app) {
    this.app = app
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    MYSQL.init(this.app.config.mysql)
  }

  async serverDidReady() {
    // Server is listening.
    const app = this.app
    this.app.sessionStore = {
      async get(key) {
        const res = await app.redis.get(key)
        if (!res) return null
        return JSON.parse(res)
      },

      async set(key, value, maxAge) {
        // maxAge not present means session cookies
        // we can't exactly know the maxAge and just set an appropriate value like one day
        if (!maxAge) maxAge = 24 * 60 * 60 * 1000
        value = JSON.stringify(value)
        await app.redis.set(key, value, 'PX', maxAge)
      },

      async destroy(key) {
        await app.redis.del(key)
      }
    }
    // crawler(this.app)
  }

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook
