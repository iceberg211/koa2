const Koa = require('koa')
const app = new Koa()

const mid = async (ctx, next) => {
  // 交出中间件
  ctx.body = 'hi'
  await next()
  ctx.body = ctx.body + 'There'
}

const mid1 = async (ctx, next) => {
  ctx.body = 'text/htmlcharset=utf-8'
  await next()
}

const mid2 = async (ctx, next) => {
  ctx.body = ctx.body + 'Luke'
  await next()
}

app.use(async ctx => {
  ctx.body = 'Hello World'
})

// app.use(mid)
// app.use(mid1)
// app.use(mid2)


app.listen(3000)
// 在koa中一切皆是中间件,在每一个中间件中需要使用 await next交出中间件的控制权，如果不使用await next中间件的执行会从此中间件断掉
//  中间件的执行顺序按照app.use，(数组堆栈，先进先出，具有时间旅行功能)但是并不是完全线性，也可以是异步
function compose(middleware) {
  return function (context, next) {
    let i = -1;
    return disPatch(0);
    function disPatch(i) {
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      return Promise.resolve(fn(context, function next() {
        return disPatch(i + 1);
      }))
    }
  }
}


