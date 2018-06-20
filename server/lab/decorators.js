const Router = require('koa-router')
const glob = require('glob')
const { resolve } = require('path')
const _ = require('lodash')

const symbolPreFix = Symbol('prefix')
const routerMap = new Map()
const isArray = c => _.isArray(c) ? c : [c]

export class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new Router()
  }
  init() {
    glob.sync(resolve(__dirname, '../routes', '**/*.js')).forEach(require)
    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)
      const prefixPath = conf.target[symbolPreFix]
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`
export const controller = path => target => (target.prototype[symbolPreFix] = path)


const router = config => (target, key, descriptor) => {
  config.path = normalizePath(config.path)
  routerMap.set({
    target: target,
    ...config
  }, target[key])
}

export const get = path => router({
  method: 'get',
  path: path
})
export const post = path => router({
  method: 'post',
  path: path
})
export const put = path => router({
  method: 'put',
  path: path
})
export const del = path => router({
  method: 'del',
  path: path
})

export const all = path => router({
  method: 'all',
  path: path
})


export const use = path => router({
  method: 'use',
  path: path
})
