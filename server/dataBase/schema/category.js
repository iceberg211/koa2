const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types;

// 定义数据库单条数据模型
const CategorySchema = new Schema({
  name: {
    unique: true,
    type: String,
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    }, updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
// 增加保存钩子
CategorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
mongoose.model('Category', CategorySchema);