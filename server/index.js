const Koa = require('koa');
const views = require('koa-views');
const { resolve } = require('path');
const { connect } = require('./dataBase/init')

const app = new Koa();

; (async () => {
  await connect()
})()

// 视图中间件
app.use()

app.use(async (ctx, next) => {
  // await ctx.render('index', {
  //   name: 'hewei'
  // })
  console.log('listen at 3000')
});

app.listen(3000)