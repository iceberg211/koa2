```
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```
# application对象
application是一个基本类,提供了传入中间件，监听服务器端口生成一个服务器实例，在node.js中http.server，逐层过中间件数组，然后把处理过的中间件数组交给handleResope，经过类型判别然后返回结果.通过除去边界值判断和兼容，代码不超过150行，以下为精简代码版本。


```
graph LR 
Use-->listen;
listen-->application;
application-->callback;
callback-->createContext;
createContext-->上下文;
createContext-->cookis,ip,;
createContext-->context.app=this;
callback-->handleRequest;
handleRequest-->respond;
respond-->res(end); 
handleRequest-->compoese(middlewares);

```

```
module.exports = class Application extends Emitter {
 constructor() {
    super();

    this.proxy = false;
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  /**
   * Shorthand for:
   *
   * 通过http模块创造一个服务实例，服务实例监听端口http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   * 
   */
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn,参数为一个函数
   * @return {Application} self
   * @api public
   */

  use(fn) {
    this.middleware.push(fn);
    return this;
  }
  
  callback() {
    const fn = compose(this.middleware);

    if (!this.listeners('error').length) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
  
  /**
   * Handle request in callback.
   * 首先设置默认的状态码为404，把上下文交给传入的中间件数字，然后把结果传递给handleResponse
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
}
```
# context 

 声明了一个对象proto,使用delegate把后续所有的方法加在proto上，在application使用object.create()方法创造了一个新的proto对象赋值给了this.context，所以上下文对象上有很多方法。总结通过上下文对象，把req和res上所有的方法交给context
 ```
 var proto={}
 delegate(proto,'response')
 ```
 ```
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
 ```
 # request
 
   暴露了一个对象，
   
 # response
 同request一样，暴漏了一个对象，
 vary是一个内容协商，列出一个
 
 # 中间件
  在koa中一切皆是中间件,在每一个中间件中需要使用 await,next交出中间件的控制权，如果不使用await next中间件的执行会从此中间件断掉
  中间件的执行顺序按照app.use，(数组堆栈，先进先出，具有时间旅行功能)但是并不是完全线性，也可以是异步.
  ```
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

 app.use(mid)
 app.use(mid1)
 app.use(mid2)
 // 输出

  ```
  尾部递归
  
  ```
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


  
  ```
  

