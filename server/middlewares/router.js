const { Route } = require('../lab/decorators');
const { resolve } = require('path')

export const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const router = new Route(app, apiPath)
  router.init()
}