const cluster = require('cluster')
if (cluster.isMaster) {
  let numCPUs = require('os').cpus().length
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
} else if (cluster.isWorker) {
  require('./app')
}
