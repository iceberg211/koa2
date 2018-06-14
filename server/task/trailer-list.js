const cp = require('child_process')
const { resolve } = require('path')

  // 脚本任务，将爬虫任务交给子进程跑
  ; (async () => {
    const script = resolve(__dirname, '../crawler/trailer-list.js')
    const child = cp.fork(script, [])
    let invoked = false

    child.on('error', err => {
      if (invoked) return

      invoked = true

    })

    child.on('exit', code => {
      if (invoked) return

      invoked = true
      let err = code === 0 ? null : new Error('exit code ' + code)

      console.log(err)
    })

    child.on('message', data => {
      let result = data.result
      console.log(result)
    })
  })()