import VerifyEmailNotification from '#mails/verify_email_notification'
import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'

export default class RegisterController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async store({ request, response }: HttpContext) {
    const { email, username, password } =
      await request.validateUsing(registerValidator)

    try {
      const user = await User.create({
        email,
        username,
        password,
      })

      const verifyUrl =
        `${env.get('APP_URL')}/verify-email/${user.id}`

      await mail.send(
        new VerifyEmailNotification(user, verifyUrl)
      )

      return response.redirect().toRoute('auth.verify.notice')
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'Gagal membuat user',
      })
    }
  }
}
