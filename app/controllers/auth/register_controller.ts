import VerifyEmailNotification from '#mails/verify_email_notification'
import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

export default class RegisterController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async store({ request, response, inertia }: HttpContext) {
    const { email, username, password } =
      await request.validateUsing(registerValidator)

    /**
     * Gunakan transaction agar konsisten
     */
    const trx = await db.transaction()

    try {
      /**
       * Create user
       */
      const user = await User.create(
        {
          email,
          username,
          password,
        },
        { client: trx }
      )

      /**
       * Generate verification token
       */
      const rawToken = crypto.randomBytes(32).toString('hex')
      const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex')

      /**
       * Simpan token ke tabel email_verifications
       */
      await trx
        .insertQuery()
        .table('email_verifications')
        .insert({
          user_id: user.id,
          token_text: hashedToken,
          expired_at: DateTime.now().plus({ hours: 24 }).toSQL(),
          created_at: DateTime.now().toSQL(),
        })

      /**
       * Build verification URL
       */
      const verifyUrl =
        `${env.get('APP_URL')}/verify-email?token=${rawToken}`

      /**
       * Kirim email
       */
      await mail.send(
        new VerifyEmailNotification(user, verifyUrl)
      )

      await trx.commit()

 if (request.accepts(['json'])) {
      return response.created({
        message: 'User registered. Verification email sent.',
      })
    }

    return inertia.render('auth/verifyNotice')
    } catch (error) {
      await trx.rollback()
      console.error(error)

      return response.internalServerError({
        message: 'Gagal membuat user',
      })
    }
  }
}
