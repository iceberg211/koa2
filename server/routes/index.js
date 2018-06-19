const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router();

// 路由可以添加中间件，类似于路由钩子,传入多中间件数组

@controller('/api/v0/movies')
export class moiveController {
  @get('/')
  async getMovies(ctx, next) {
    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({}).sort({
      'meta.createdAt': -1,
    })
    ctx.body = {
      movies
    }
  }
  @get('/:id')
  async getMoviesDetail(ctx, next) {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movie = await Movie.findOne({ _id: id })
    ctx.body = {
      movie
    }
  }
}


// router.get('/movies', async (ctx, next) => {
//   const Movie = mongoose.model('Movie')
//   const movies = await Movie.find({}).sort({
//     'meta.createdAt': -1,
//   })
//   ctx.body = {
//     movies
//   }
// })

// router.get('/movies/:id', async (ctx, next) => {
//   const Movie = mongoose.model('Movie')
//   const id = ctx.params.id
//   const movie = await Movie.findOne({ _id: id })
//   ctx.body = {
//     movie
//   }
// })

module.exports = router;
// 路由变得复杂的时候，类似与expres的概念，router可以嵌套，对请求参数，进行加工，文件数比较多，子路由
// 通过装饰器来改造路由文件,类似于命名空间的概念
