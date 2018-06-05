let Promise = require('bluebird')
let _ = require('lodash')
let async = require('async')
let jm = require('jm-dao')
let event = require('jm-event')
let config = require('../../config')
let WechatAPI = require('wechat-api')
let MS = require('jm-ms')
let Oauth = require('wechat-oauth')
let Logger = require('./logger')
let UserWechat = require('./user')

let ms = MS()
let logger = Logger('main', __filename)

module.exports = function (opts) {
  opts = opts || {}
  let db = opts.db
  opts.config = opts.config || {}
  _.defaultsDeep(opts.config, config)
  config = opts.config
  console.log('wechat config version : ' + config.env)

  let o = {
    ready: false,
    config: config,
    getLogger: Logger,
    api: new WechatAPI(config.appid, config.appsecret),
    oauth: new Oauth(config.appid, config.appsecret),
    onReady: function () {
      let self = this
      return new Promise(function (resolve, reject) {
        if (self.ready) return resolve(self.ready)
        self.on('ready', function () {
          resolve()
        })
      })
    }
  }
  event.enableEvent(o)

  let bind = function (name, alias, uri) {
    uri === undefined && (uri = opts.gateway + '/' + name)
    ms.client({
      uri: uri
    }, function (err, doc) {
      !err && doc && (o[alias || name] = doc)
    })
  }
  bind('user')

  let cb = function (db) {
    opts.db = db
    o.userWechat = UserWechat(o, opts)

    o.ready = true
    o.emit('ready')
    logger.info('服务启动')
  }

  if (!db) {
    db = jm.db.connect().then(cb)
  } else if (typeof db === 'string') {
    db = jm.db.connect(db).then(cb)
  }

  return o
}

