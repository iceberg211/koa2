// 用于发起服务端对服务器api的请求
// request的封装
const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/${item.doubanId}`
    let res = await rp(url)
    try {
        res = JSON.parse(res)
    } catch (err) {
        res = null
    }
    return res
}


; (async () => {

    let movies = await Movie.find({
        $or: [
            // 筛选条件
            { summary: { $exists: false } },
            { summary: null },
            { title: '' },
            { summary: '' }
        ]
    })
    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        let movieData = await fetchMovie(movie)

        if (movieData) {
            let tags = movieData.tags || []
            movie.tags = tags;
            movie.summary = movieData.summary || '';
            movie.title = movieData.alt_title || movieData.title || '';
            movie.rawTitle = movieData.title || '';
            if (movieData.attrs) {
                movie.movieTypes = movieData.attrs.movie_type || []
                movie.year = movieData.attrs.year[0] || 2500
                for (let i = 0; i < movie.movieTypes.length; i++) {
                    let item = movie.movieTypes[i]
                    let cat = await Category.findOne({
                        name: item
                    })
                    // 如果不存在
                    if (!cat) {
                        cat = new Category({
                            name: item,
                            movies: [movie._id]
                        })
                    } else {
                        if (cat.movies.indexOf(movie._id) === -1) {
                            cat.movies.push(movie._id)
                        }
                    }
                    await cat.save()
                    // 如果电影专辑不存在
                    if (!movie.category) {
                        movie.category.push(cat._id)
                    } else {
                        if (movie.category.indexOf(cat._id) === -1) {
                            movie.category.push(cat._id)
                        }
                    }

                }
                let dates = movieData.attrs.pubdate || []
                let pubdates = []
                // 遍历所有的时间
                dates.map(item => {
                    if (item && item.split('(').length > 0) {
                        let parts = item.split('(')
                        let date = parts[0]
                        let country = '未知'

                        if (parts[1]) {
                            country = parts[1].split(')')[0]
                        }

                        pubdates.push({
                            date: new Date(date),
                            country
                        })
                    }
                })
                movie.pubdate = pubdates
            }
            await movie.save()
        }
    }
})() 