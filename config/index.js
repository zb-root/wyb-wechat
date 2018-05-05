require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
let config = {
  development: {
    debug: true,
    port: 3000,
    lng: 'zh_CN',
    prefix: '/wechat',
    domain: 'www.wyb.jamma.cn',
    appid: 'wx7c7aa23a249cf275',
    appsecret: '438984dc3501b8f6f79afe5ceeed8d06',
    db: 'mongodb://root:123@api.h5.jamma.cn/wyb?authSource=admin',
    gateway: 'http://api.wyb.jamma.cn:81',
    token: 'weixin',
    encodingAESKey: 'tQVHbJ5vZEfnsKzoPxq8xlpKF1J2ZnQsZB8wMcWLC16'
  },
  production: {
    debug: false,
    port: 80,
    lng: 'zh_CN',
    prefix: '/wechat',
    domain: 'www.wyb.jamma.cn',
    appid: 'wx7c7aa23a249cf275',
    appsecret: '438984dc3501b8f6f79afe5ceeed8d06',
    db: 'mongodb://root:123@api.h5.jamma.cn/main?authSource=admin',
    gateway: 'http://gateway.app',
    token: 'weixin',
    encodingAESKey: 'tQVHbJ5vZEfnsKzoPxq8xlpKF1J2ZnQsZB8wMcWLC16'
  }
}

let env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env;

['debug', 'port', 'lng', 'prefix', 'domain', 'db', 'gateway', 'appid', 'appsecret', 'encodingAESKey', 'token'].forEach(function (key) {
  process.env[key] && (config[key] = process.env[key])
})

module.exports = config
