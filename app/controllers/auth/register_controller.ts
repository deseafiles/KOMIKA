import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async store({ request, response, auth }: HttpContext) {
    const { email, username, password } = await request.validateUsing(registerValidator)
    try {
      const user = await User.create({ email, username, password })

      //return response.ok({ message: 'User berhasil dibuat', data: user })
      await auth.use('web').login(user)
      return response.redirect().toRoute('home')
    } catch (error) {
      console.error(error)
      return response.send('Gagal membuat user')
    }
  }
}
