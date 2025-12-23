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
      // 1️⃣ Verifikasi kredensial
      const user = await User.verifyCredentials(username, password)

      // 2️⃣ Cek email verified
      if (!user.isVerified) {
        return inertia.render('auth/login', {
          errors: { email: 'Silakan verifikasi email terlebih dahulu.' },
          old: { username }
        })
      }

      // 3️⃣ Login user
      await auth.use('web').login(user)

      // 4️⃣ Redirect sesuai role/status
      if (user.isAdmin) return response.redirect().toRoute('AdminHomepage')
      if (user.isBanned) return response.redirect().toRoute('banPage')
      return response.redirect().toRoute('home')

    } catch (error) {
      return inertia.render('auth/login', {
        errors: { E_INVALID_CREDENTIALS: 'Username atau password salah.' },
        old: { username }
      })
    }
  }
}
