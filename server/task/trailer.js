// 子进程
const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')


  ; (async () => {
    // 拿到脚本
    const script = resolve(__dirname, '../crawler/trailer.js')
    // 注册一个子进程
    const child = cp.fork(script, [])

    let invoked = false

    child.on('error', err => {
      if (invoked) return

      invoked = true

      console.log(err)
    })

    child.on('exit', code => {
      if (invoked) return

      invoked = true
      let err = code === 0 ? null : new Error('exit code ' + code)
      console.log(err)
    })
    // 消息获取，当拿到data后
    child.on('message', data => {
      console.log(data)
      let result = data.result;
      // result.forEach(async item => {
      //   // 当前数据是否存储过
      //   let movie = await Movie.findOne({
      //     doubanId: item.doubanId
      //   })
      //   if (!movie) {
      //     movie = new Movie(item)
      //     await movie.save();
      //   }
      // });
    })
  })()