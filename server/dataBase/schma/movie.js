const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types.Mixed;

// 定义数据库单条数据模型
const movieSchema = new Schema({
  doubanId: {
    unique: true,
    required: true,
    type: String,
  },
  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,
  videoKey: String,
  posterKey: String,
  coverKey: String,
  rawTitle: String,
  movieTypes: [String],
  pudbate: Mixed,
  year: Number,
  tags: Array,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
})
// 增加保存钩子
movieSchema.pre('save', next => {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
mongoose.model('Movie', movieSchema);