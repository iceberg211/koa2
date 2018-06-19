const Router = require('koa-router')
const glob = require('glob')
const resolve = require('path')

const symbolPreFix = Symbol('prefix')

export class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new Router()
  }
  init() {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
  }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`
const controller = path => target => (target.prototype[symbolPreFix] = path)


const router = config => (target, key, descriptor) => {
  config.path = normalizePath(config.path)
}

const get = path => router({
  method: 'get',
  path: path
})