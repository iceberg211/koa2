const Koa = require('koa');
const views = require('koa-views');
const mongoose = require('mongoose')
const pug = require('pug')
const { resolve } = require('path')
const { connect, initSchemas } = require('./dataBase/init')


  ; (async () => {
    await connect()
    const Movie = mongoose.model('Movie')
    const movie = await Movie.find({})
    console.log('数据初始化', movie)
  })();

const app = new Koa();
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