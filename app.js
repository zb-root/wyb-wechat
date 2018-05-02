let express = require('express')
let http = require('http')
let path = require('path')
let bodyParser = require('body-parser')
let _ = require('lodash')
let async = require('async')

let app = express()
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}))
app.set('trust proxy', true) // 支持代理后面获取用户真实ip

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, Authorization, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method == 'OPTIONS')
    res.sendStatus(200)
  else
    next()
})

let config = require('./config')
let routes = require('./routes')
routes(app, config)

/*
 * start server
 * */
http.createServer(app).listen(config.port, function () {
  console.log('Express server listening on port ' + config.port)
})

process.on('uncaughtException', function (err) {
  console.error('Caught exception: ' + err.stack)
})
