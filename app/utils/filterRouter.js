const pathToRegexp = require('path-to-regexp')

module.exports = (request, url, method) => {
  const regexp = pathToRegexp(url)
  if (request.method === method) {
    let url = request.path
    if (method === 'GET') {
      if (/\?/.test(url)) {
        url = url.match(/(\S*)\?/)[1]
      } else if (/&/.test(url)) {
        url = url.match(/(\S*)&/)[1]
      }
    }
    return regexp.test(url)
  }
  return false
}
