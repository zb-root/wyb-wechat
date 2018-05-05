let express = require('express')
let wechat = require('wechat')
let async = require('async')

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiSuccessExample {json} 错误:
 * {
 *   err: 错误代码
 *   msg: 错误信息
 * }
 */

module.exports = function (service, opts) {
  let logger = service.getLogger('main', __filename)
  let router = express.Router(opts)

  let done = function (message, req, res, replyEmpty) {
    let s = JSON.stringify(message)
    logger.debug('wechat received: ' + s)
    if (replyEmpty) {
      res.reply('')
    } else {
      res.reply('谢谢关注')
    }
  }

  service.onReady().then(() => {
    router.use('/api', require('./api')(service, opts))

    router.use('/authuri', function (req, res) {
      let redirect_uri = req.query.redirect_uri || req.query.uri || req.body.redirect_uri || req.body.uri
      let surl = 'http://' + service.config.domain + '/wechat_oauth.html?redirect_uri=' + encodeURIComponent(redirect_uri)
      let url = service.oauth.getAuthorizeURL(surl, '', 'snsapi_userinfo')
      res.send({uri: url})
    })

    router.use('/message', function (req, res, next) {
      console.log(req.query)
      next()
    }, wechat({
      appid: opts.appid, token: opts.token, encodingAESKey: opts.encodingAESKey
    }).text(function (message, req, res, next) {
      done(message, req, res)
    }).image(function (message, req, res, next) {
      done(message, req, res)
    }).voice(function (message, req, res, next) {
      done(message, req, res)
    }).video(function (message, req, res, next) {
      done(message, req, res)
    }).location(function (message, req, res, next) {
      done(message, req, res)
    }).link(function (message, req, res, next) {
      done(message, req, res)
    }).event(function (message, req, res, next) {
      //用户关注响应: {"ToUserName":"gh_2838d80c83f4","FromUserName":"oJ6Nd0kknUyGuGyTo8QyXGQHyTAc","CreateTime":"1509862100","MsgType":"event","Event":"subscribe","EventKey":"qrscene_1000","Ticket":"gQH38DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyUFNFLXdKRHpkdGkxY2N1N05xY1AAAgSLo-5ZAwSAOgkA"}
      //用户取消关注响应:{"ToUserName":"gh_2838d80c83f4","FromUserName":"oJ6Nd0kknUyGuGyTo8QyXGQHyTAc","CreateTime":"1509862083","MsgType":"event","Event":"unsubscribe","EventKey":""}
      //用户已关注响应: {"ToUserName":"gh_2838d80c83f4","FromUserName":"oJ6Nd0kknUyGuGyTo8QyXGQHyTAc","CreateTime":"1509862498","MsgType":"event","Event":"SCAN","EventKey":"1000","Ticket":"gQH38DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyUFNFLXdKRHpkdGkxY2N1N05xY1AAAgSLo-5ZAwSAOgkA"}
      /**
       * Event字段为事件类型, 监听['subscribe', 'SCAN']事件可实现用户与代理绑定
       * FromUserName字段为微信用户openid
       * EventKey字段为事件值, 代理号可从这里取(注:subscribe事件的值会多出前缀,取值需要截取)
       */
      if (message.Event === 'subscribe' || message.Event === 'SCAN') {      //无论是否第一次关注，都要先查出该微信玩家是否已注册过账号

      }
      done(message, req, res, true)
    }).middlewarify())
  })

  return router
}