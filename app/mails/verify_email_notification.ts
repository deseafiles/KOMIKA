import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'

export default class VerifyEmailNotification extends BaseMail {
  subject = 'Verify your email address'

  constructor(
    private user: User,
    private url: string
  ) {
    super()
  }

  prepare() {
    this.message
      .to(this.user.email)
      .from(
        env.get('MAIL_FROM_ADDRESS') || "webkomika@gmail.com",
        env.get('MAIL_FROM_NAME')
      )
      .htmlView('emails/verify', {
        user: this.user,
        url: this.url,
      })
  }
}
