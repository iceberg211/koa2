const fs = require('fs');
const Promise = require('bluebird')

// 通过回掉函数
function readFile(cb) {
  fs.readFile('./package.json', (err, data) => {
    if (err) return cb(err)
    cb && cb(null, data)
  })
}
readFile((err, data) => {
  if (!err) {
    data = JSON.parse(data)
  }
})

// 第二阶段通过promise
function readFileAsync() {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject();
      else resolve(data);
    })
  })
}
readFileAsync('./package.json').then(data => { }).catch(err => console.log(err))

// 第三阶段通过 co+Generator fuction +Promise

const co = require('co')
const util = require('util')

co(function* () {
  let data = yield util.promisify(fs.readFile)('./package.json')
  data = JSON.parse(data)
})

// 第四阶段 async
const readAsync = util.promisify(fs.readFile)

async function init() {
  let data = await readAsync('./package.json')
  data = JSON.parse(data)
}

init()