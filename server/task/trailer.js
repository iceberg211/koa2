// 子进程
const cp = require('child_process')
const { resolve } = require('path')

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
      console.log('子进程任务', data)
    })
  })()