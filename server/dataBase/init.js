const mongoose = require('mongoose')
const glob = require('glob')
const { resolve } = require('path')


mongoose.Promise = global.Promise

const dbUrl = 'mongodb://127.0.0.1:27017/test';


exports.connect = () => {
  let maxConnectTimes = 0;
  return new Promise((resolve, reject) => {
    if (process.env.NODE !== 'production') {
      mongoose.set('debug', true)
    }
    mongoose.connect(dbUrl, {
      useMongoClient: true,
    });

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(dbUrl, {
          useMongoClient: true,
        })
      } else {
        throw new Error('数据库挂了')
      }

    })
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(dbUrl, {
          useMongoClient: true,
        })
      } else {
        throw new Error('数据库挂了')
      }
    })
    mongoose.connection.once('open', () => {
      const Dog = mongoose.model('Dog', { name: String })
      const dog = new Dog({ name: '阿尔法' })
      dog.save().then(() => {
        console.log('保存成功')
      })
      resolve()
      console.info('mogoDB成功连接')
    })
  })
}

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}