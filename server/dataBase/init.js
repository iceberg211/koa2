const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const dbUrl = 'mongodb://127.0.0.1:27017/koa2';


exports.connect = () => {
  if (process.env.NODE !== 'production') {
    mongoose.set('debug', true)
  }
  mongoose.connect(dbUrl, {
    useMongoClient: true,
  });

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(dbUrl, {
      useMongoClient: true,
    })
  })
  mongoose.connection.on('error', err => {
    console.log(err)
  })
  mongoose.connection.once('open', () => {
    console.info('mogoDB成功连接')
  })
}