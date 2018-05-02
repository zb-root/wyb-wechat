let express = require('express')

module.exports = function (app, opts) {
  opts = opts || {}
  app = app || express.Router(opts)
  let service = require('../lib')(opts)
  let logger = service.getLogger('main', __filename)
  app.service = service

  // app.use(require('log4js').connectLogger(logger, {level: 'auto'}))

  let pkg = require('../package.json')
  app.get(opts.prefix || '', function (req, res) {
    res.send({
      name: pkg.name,
      version: pkg.version
    })
  })

  let router = service.router(opts)
  app.use(opts.prefix || '', router)

  return app
}


