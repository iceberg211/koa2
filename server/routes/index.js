const mongoose = require('mongoose')
const {
  getAllMovies,
  getRelativeMovies,
  getSingleMovie
} = require('../service/movie')
const {
  get,
  post,
  controller,
  put } = require('../lab/decorators')

// 路由可以添加中间件，类似于路由钩子,传入多中间件数组
@controller('/api/v0/movies')
export class movieController {
  @get('/')
  async getMovies(ctx, next) {
    const { type, year } = ctx.query
    const movies = await getAllMovies(type, year)
    ctx.body = {
      movies
    }
  }
  @get('/detail/:id')
  async getMovieDetail(ctx, next) {
    const id = ctx.params.id
    const movie = await getSingleMovie(id)
    const relativeMovies = await getRelativeMovies(movie)
    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}

