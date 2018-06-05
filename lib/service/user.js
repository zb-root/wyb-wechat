let jm = require('jm-dao')
let event = require('jm-event')
let _schema = require('../schema/user-wechat')

module.exports = function (service, opts) {
  let schema = opts.schema || _schema()

  let model = jm.dao({
    db: opts.db,
    modelName: opts.modelName || 'user-wechat',
    tableName: opts.tableName,
    prefix: opts.tableNamePrefix,
    schema: schema,
    schemaExt: opts.schemaExt
  })
  event.enableEvent(model)

  return model
}
