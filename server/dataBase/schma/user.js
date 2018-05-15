const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed;
// 加密权重
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

// 定义数据库单条数据模型,彩虹表碰撞
const userSchema = new Schema({
  userName: {
    unique: true,
    type: String,
    required: true,
  },
  email: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    unique: true,
    type: String,
  },
  lockUntil: Number,
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 虚拟字段，用来比较用户密码的锁定时间,有没有被锁定
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.methods = {
  // 比对密码的静态方法
  comparePassWord: (_password, possward) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else inject(err)
      })
    })
  },
  // 密码频繁登陆，尝试错误登陆5次
  incLoginAttempts: (user) => {
    const that = this
    return new Promise((resolve, reject) => {
      if (that.lockUntil && that.lockUntil < Date.now()) {
        // 原子操作
        that.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            // 
            lockUntil: 1
          }
        }, function (err) {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        // 如果没有命中
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }

        if (that.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !that.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        that.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }

}

// 对中间件密码进行加盐
userSchema.pre('save', next => {
  // 查看某个字段是否被更改
  if (this.isModified('password')) return next();
  /*
   * bcrypt是一个加密库,bcrypt.getSalt()
   */
  bcrypt.genSalt(SALT_WORK_FACTOT, (err, salt) => {
    if (err) return next(err)
    // 加盐加密
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      this.password = hash;
      next()
    })
    next()
  })
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})


mongoose.model('User', userSchema);