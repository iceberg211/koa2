const fs = require('fs');
const Promise = require('bluebird')
// 传统异步
fs.readFile('./package.json', (err, data) => {
  if (err) {
    return console.log(err);
  }
  data = JSON.parse(data)
})

// 过渡写法
function readFileAsync() {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject();
      else resolve(data);
    })
  })
}

//  使用promisify来包装
const util = require('util')
util.promisify(fs.readFile)('./package.json').then(JSON.parse).then(data => {
  console.log(data.name)
}).catch(err => {
  console.log(err);
})
