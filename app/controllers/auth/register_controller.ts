import sendVerifyEmail from '#mails/sendVerifyEmail'
import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import { createVerificationToken } from '#services/EmailVerificationService'

export default class RegisterController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async store({ request, response, inertia }: HttpContext) {
    const { email, username, password } =
      await request.validateUsing(registerValidator)

    const existingUser = await User.findBy('email', email)

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Hapus token verifikasi lama
        await db
          .from('email_verifications')
          .where('user_id', existingUser.id)
          .delete()

        const token = await createVerificationToken(existingUser.id)
        const verifyUrl = `${env.get('APP_URL')}/verify-email?token=${token}`

        // Kirim ulang email verifikasi via Gmail API
        sendVerifyEmail(existingUser.email, verifyUrl).catch(console.error)

        return inertia.render('auth/verifyNotice', {
          email,
          resend: true,
        })
      }

      return inertia.render('auth/register', {
        errors: { email: 'Email sudah terdaftar' },
      })
    }

    const trx = await db.transaction()

    let user
    try {
      user = await User.create(
        { email, username, password, isVerified: false },
        { client: trx }
      )

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }

    const token = await createVerificationToken(user.id)
    const verifyUrl = `${env.get('APP_URL')}/verify-email?token=${token}`

    // Kirim email verifikasi via Gmail API
    sendVerifyEmail(user.email, verifyUrl).catch(console.error)

    return inertia.render('auth/verifyNotice', { email })
  }
}
