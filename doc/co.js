const co = require('co')
const fetch = require('node-fetch')

// co可以接收generator函数，转换成promise ，类似于saga中的异步任务队列
co(function* () {
  const res = yield fetch('url')
  const movie = yield res.json()
  const summary = movie.summary
})


// 通过run来模拟co，yilld不能
function run(generator) {
  const iterator = generator()
  const it = iterator.next()
  const promise = it.value

  promise.then(data => {
    const it2 = iterator.next()
    const promise2 = it2.value
    promise2.then(data2 => {
      iterator.next(data2)
    })
  })
}

run(function* () {
  const res = yield fetch('url')
  const movie = yield res.json()
  const summary = movie.summary
})