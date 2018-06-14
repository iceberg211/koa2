const qiniu = require('qiniu')
// const mongoose = require('mongoose')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

// const Movie = mongoose.model('Movie')

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      }
      else {
        if (info.statusCode === 200) {
          resolve({ key })
        } else {
          reject(info)
        }
      }
    })
  })
}

  ; (async () => {
    // let movies = await Movie.find({
    //   $or: [
    //     { videoKey: { $exists: false } },
    //     { videoKey: null },
    //     { videoKey: '' }
    //   ]
    // }).exec()

    let movies = [
      {
        video: 'http://vt1.doubanio.com/201806131948/73aaea168c4a7c41b6190900698e6c5c/view/movie/M/402290187.mp4',
        doubanId: 4920389,
        cover: 'https://img3.doubanio.com/img/trailer/medium/2517604390.jpg',
        poster: 'https://img3.doubanio.com/img/trailer/medium/2517604390.jpg',
      }
    ]
    for (let i = 0; i < movies.length; i++) {
      let movie = movies[i]

      if (movie.video && !movie.videoKey) {
        try {
          let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
          let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
          let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

          console.log(videoData)
          console.log(movie)

          if (videoData.key) {
            movie.videoKey = videoData.key
          }
          if (coverData.key) {
            movie.coverKey = coverData.key
          }
          if (posterData.key) {
            movie.posterKey = posterData.key
          }

          // await movie.save()
        } catch (err) {
          console.log(err)
        }
      }
    }
  })()
