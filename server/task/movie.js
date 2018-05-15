const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

  // 脚本任务，将爬虫任务交给子进程跑
  ; (async () => {
    const script = resolve(__dirname, '../crawler/video.js')
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

    child.on('message', data => {
      let result = data.result
      // 将结果写入数据库之中,逻辑是与数据库之中做出比较
      result.forEach(async item => {
        let
      })
      console.log(result)
    })
  })()