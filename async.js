const fs = require('fs')
const util = require('util')
const readAsync = util.promisify(fs.readFile)

// 在node.js 4X，或者6X版本需要借助babel编译成中
async function init() {
  try {
    let data = await readAsync('./package.json')
    data = JSON.parse(data)

  } catch (error) {
    console.log(error)
  }
}