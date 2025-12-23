import sendVerifyEmail from '#mails/verify_email_notification'
import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

export default class RegisterController {
  /**
   * Halaman register
   */
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Proses register
   */
  async store({ request, response, inertia }: HttpContext) {
    const { email, username, password } =
      await request.validateUsing(registerValidator)

    /**
     * =====================================================
     * 1. CEK EMAIL SUDAH ADA ATAU BELUM
     * =====================================================
     */
    const existingUser = await User.findBy('email', email)

    if (existingUser) {
      /**
       * 1a. EMAIL SUDAH ADA TAPI BELUM VERIFIED
       * → RESEND EMAIL VERIFIKASI
       */
      if (!existingUser.isVerified) {
        // hapus token lama
        await db
          .from('email_verifications')
          .where('user_id', existingUser.id)
          .delete()

        const rawToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto
          .createHash('sha256')
          .update(rawToken)
          .digest('hex')

        await db.table('email_verifications').insert({
          user_id: existingUser.id,
          token_text: hashedToken,
          expired_at: DateTime.now().plus({ hours: 24 }).toSQL(),
          created_at: DateTime.now().toSQL(),
        })

        const verifyUrl =
          `${env.get('APP_URL')}/verify-email?token=${rawToken}`

        await sendVerifyEmail(existingUser.email, verifyUrl)

        return inertia.render('auth/verifyNotice', {
          email,
          resend: true,
        })
      }

      /**
       * 1b. EMAIL SUDAH VERIFIED
       * → TOLAK
       */
      return inertia.render('auth/register', {
        errors: {
          email: 'Email sudah terdaftar',
        },
      })
    }

    /**
     * =====================================================
     * 2. EMAIL BELUM ADA → BUAT USER BARU
     * =====================================================
     */
    const trx = await db.transaction()

    try {
      /**
       * 2a. CREATE USER
       */
      const user = await User.create(
        {
          email,
          username,
          password,
          isVerified: false,
        },
        { client: trx }
      )

      /**
       * 2b. GENERATE TOKEN
       */
      const rawToken = crypto.randomBytes(32).toString('hex')
      const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex')

      /**
       * 2c. SIMPAN TOKEN
       */
      await trx.table('email_verifications').insert({
        user_id: user.id,
        token_text: hashedToken,
        expired_at: DateTime.now().plus({ hours: 24 }).toSQL(),
        created_at: DateTime.now().toSQL(),
      })

      /**
       * 2d. KIRIM EMAIL
       */
      const verifyUrl =
        `${env.get('APP_URL')}/verify-email?token=${rawToken}`

      await sendVerifyEmail(user, verifyUrl)


      await trx.commit()

      /**
       * 2e. RESPONSE
       */
      if (request.accepts(['json'])) {
        return response.created({
          message: 'User registered. Verification email sent.',
        })
      }

      return inertia.render('auth/verifyNotice', {
        email,
      })
    } catch (error) {
      await trx.rollback()
      console.error(error)

      return response.internalServerError({
        message: 'Gagal membuat user',
      })
    }
  }
}
