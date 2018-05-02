let service = require('./service')

module.exports = function (opts) {
  opts = opts || {};

  ['db', 'gateway', 'appid', 'appsecret', 'encodingAESKey', 'token'].forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  let o = service(opts)

  o.router = function (opts) {
    return require('./router')(o, opts)
  }

  return o
}