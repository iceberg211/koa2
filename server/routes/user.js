const mongoose = require('mongoose')
const {
  checkPassWord,
} = require('../service/admin')
const {
  get,
  post,
  controller,
  put } = require('../lab/decorators')

// 路由可以添加中间件，类似于路由钩子,传入多中间件数组

@controller('/admin')
export class adminController {
  @post('/')
  async adminLogin(ctx, next) {
    const { email, password } = ctx.request.body
    const data = await checkPassword(email, password)
    const { user, match } = data

    if (!user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }
    if (match) {
      ctx.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username
      }
      return (ctx.body = {
        success: true,
        data: {
          email: user.email,
          username: user.username
        }
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码错误'
    })
  }
}


