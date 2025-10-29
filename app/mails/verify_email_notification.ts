import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'

export default class VerifyEmailNotification extends BaseMail {
  from = 'Komika <no-reply@komika.com>'
  subject = 'Verify your email address'
  user: User
  url: string

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  constructor(user: User, url: string) {
    super()
    this.user = user
    this.url = url
  }

  prepare() {
    this.message.to(this.user.email)
    this.message.htmlView('emails/verify', { user: this.user, url: this.url })
  }
}
