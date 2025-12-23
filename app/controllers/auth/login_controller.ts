import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

export default class LoginController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

async store({ request, response, auth, session, inertia }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(username, password)

      if (!user.isVerified) {
        return inertia.render('auth/login', {
          errors: { email: 'Silakan verifikasi email terlebih dahulu.' },
          old: { username }
        })
      }

      await auth.use('web').login(user)

      if (user.isAdmin) return response.redirect().toRoute('AdminHomepage')
      if (user.isBanned) return response.redirect().toRoute('banPage')
      return response.redirect().toPath('/')
    } catch (error) {
      return inertia.render('auth/login', {
        errors: { E_INVALID_CREDENTIALS: 'Username atau password salah.' },
        old: { username }
      })
    }
  }
}
