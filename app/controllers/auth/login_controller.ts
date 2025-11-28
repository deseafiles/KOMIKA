import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

export default class LoginController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

async store({ request, response, auth }: HttpContext) {
  const { username, password } = await request.validateUsing(loginValidator)

  try {
    const user = await User.verifyCredentials(username, password)

    // Login dulu
    await auth.use('web').login(user)

    // Lalu redirect sesuai role
    if (user.isAdmin === true) {
      return response.redirect().toRoute('AdminHomepage')
    } else {
      return response.redirect().toRoute('home')
    }

  } catch (error) {
    console.error(error)
    return response.send('User Gagal Login')
  }
}
}
