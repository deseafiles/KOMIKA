import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

export default class LoginController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const { username, password } =
      await request.validateUsing(loginValidator)

    try {
      /**
       * 1. Verifikasi kredensial
       */
      const user = await User.verifyCredentials(username, password)

      /**
       * 2. CEK EMAIL VERIFICATION (INI KUNCINYA)
       */
      if (!user.isVerified) {
        session.flash('errors', {
          email: 'Silakan verifikasi email terlebih dahulu.',
        })

        return response.redirect().toRoute('auth.verify.notice')
      }

      /**
       * 3. Login setelah lolos verifikasi
       */
      await auth.use('web').login(user)

      /**
       * 4. Logic existing Anda (dipertahankan)
       */
      if (user.isAdmin === true) {
        return response.redirect().toRoute('AdminHomepage')
      }

      if (user.isBanned === true) {
        return response.redirect().toRoute('banPage')
      }

      return response.redirect().toRoute('home')

    } catch (error) {
      session.flash('errors', {
        E_INVALID_CREDENTIALS: 'Username atau password salah.',
      })

      return response.redirect().back()
    }
  }
}
