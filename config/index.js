require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
let config = {
  development: {
    debug: true,
    port: 3000,
    lng: 'zh_CN',
    prefix: '/wechat',
    appid: 'wx6e06322887658558',
    appsecret: 'afa84f6eae4d20b337a3478f3d58c5a7',
    db: 'mongodb://root:123@api.h5.jamma.cn/main?authSource=admin',
    gateway: 'http://api.wyb.jamma.cn:81',
    token: 'weixin',
    encodingAESKey: 'tQVHbJ5vZEfnsKzoPxq8xlpKF1J2ZnQsZB8wMcWLC16'
  },
  production: {
    debug: false,
    port: 80,
    lng: 'zh_CN',
    prefix: '/wechat',
    appid: 'wx6e06322887658558',
    appsecret: 'afa84f6eae4d20b337a3478f3d58c5a7',
    db: 'mongodb://root:123@api.h5.jamma.cn/main?authSource=admin',
    gateway: 'http://gateway.app',
    token: 'weixin',
    encodingAESKey: 'tQVHbJ5vZEfnsKzoPxq8xlpKF1J2ZnQsZB8wMcWLC16'
  }
}

let env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env;

['debug', 'lng', 'port', 'appid', 'appsecret', 'token', 'encodingAESKey'].forEach(function (key) {
  process.env[key] && (config[key] = process.env[key])
})

module.exports = config
