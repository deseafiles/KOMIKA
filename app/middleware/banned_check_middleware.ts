import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class BannedCheckMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.use('web').user

    if (!user) {
      return await next()
    }

    if (user.isBanned) {
      await ctx.auth.use('web').logout()
      ctx.session.flash('error', 'Akun Anda telah diblokir.')
      return ctx.response.redirect('/ban-page')
    }
    return await next()
  }
}
