const Koa = require('koa');
const views = require('koa-views');
const mongoose = require('mongoose')
const pug = require('pug')
const { resolve } = require('path')
const { connect, initSchemas } = require('./dataBase/init')


  ; (async () => {
    await connect()
    initSchemas()
    require('./task/trailer')
  })();

const app = new Koa();
// app
//   .use(router.routes())
//   .use(router.allowedMethods())

// 视图中间件
app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    name: 'hewei'
  })
  console.log('listen at 3000')
});

app.listen(3000)