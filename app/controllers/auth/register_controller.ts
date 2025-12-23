import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async store({ request, response, inertia }: HttpContext) {
    const { email, username, password } =
      await request.validateUsing(registerValidator)

    const existingUser = await User.findBy('email', email)

    if (existingUser) {
      return inertia.render('auth/register', {
        errors: {
          email: 'Email sudah terdaftar',
        },
      })
    }

    try {
      const user = await User.create({
        email,
        username,
        password,
        isVerified: true,
      })

      if (request.accepts(['json'])) {
        return response.created({
          message: 'User registered successfully.',
          user,
        })
      }

      return response.redirect().toPath('/')
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'Gagal membuat user',
      })
    }
  }
}