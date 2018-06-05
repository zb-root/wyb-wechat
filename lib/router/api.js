let express = require('express')

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

  router.get('/initmenu', function (req, res) {
    let menu = require('../../config/menu.json')

    service.api.createMenu(JSON.stringify(menu), function (err, result) {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  router.get('/jsconfig', function (req, res) {
    let url = req.query.url || req.body.url || ''
    let list = req.query.list || req.body.list
    if (list) list = Array.isArray(list) ? list : list.toString().split(',')
    let param = {
      debug: false,
      jsApiList: list || [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'onVoicePlayEnd',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
      ],
      url: url
    }
    service.api.getJsConfig(param, function (err, doc) {
      err && logger.error(err)
      res.send(doc)
    })
  })

  router.get('/qrcode', function (req, res) {
    let code = req.query.code || req.body.code || ''
    let isForever = req.query.isForever
    let expire = req.query.expire || 604800
    if (isForever) {
      service.api.createLimitQRCode(code, function (err, doc) {
        if (err) return res.send(err)
        let imgUrl = service.api.showQRCodeURL(doc.ticket)
        res.send({url: doc.url, imgUrl: imgUrl})
      })
    } else {
      service.api.createTmpQRCode(code, expire, function (err, doc) {
        if (err) return res.send(err)
        let imgUrl = service.api.showQRCodeURL(doc.ticket)
        res.send({url: doc.url, imgUrl: imgUrl, expire: doc.expire_seconds})
      })
    }
  })

  return router
}