const Koa = require('koa');
const mongoose = require('mongoose')
const R = require('ramda')
const { join } = require('path')
const { connect, initSchemas } = require('./dataBase/init')


const Middlewares = ['parcel', 'router',]

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        e => e(app)
      ),
      require,
      name => join(__dirname, `./middlewares/${name}`)
    )
  )(Middlewares)
}

  ; (async () => {
    await connect()
    initSchemas()
    const app = new Koa()
    await useMiddlewares(app)
    app.listen(3000, () => console.log('监听在3000'))
  })();



