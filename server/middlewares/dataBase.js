const mongoose = require('mongoose')
const glob = require('glob')
const { join } = require('path')

mongoose.Promise = global.Promise
const dbUrl = 'mongodb://127.0.0.1:27017/test';

glob.sync(join(__dirname, '../database/schema', '**/*.js')).forEach(require)

