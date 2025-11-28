import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

export default class LoginController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

async store({ request, response, auth, session }: HttpContext) {
  const { username, password } = await request.validateUsing(loginValidator)

  try {
    const user = await User.verifyCredentials(username, password)
    await auth.use('web').login(user)

    if (user.isAdmin === true) {
      return response.redirect().toRoute('AdminHomepage')
    } else if(user.isBanned === true){
      return response.redirect().toRoute('banPage')
    } else {
      return response.redirect().toRoute('home')
    }

  } catch (error) {
    session.flash('errors', { E_INVALID_CREDENTIALS: 'Username atau password salah.' })
  return response.redirect().back()
  }
}
}
