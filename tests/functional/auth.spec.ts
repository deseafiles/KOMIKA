import { test } from '@japa/runner'
import mail from '@adonisjs/mail/services/main'
import VerifyEmailNotification from '#mails/verify_email_notification'
import db from '@adonisjs/lucid/services/db'

test.group('Users | register', (group) => {
  group.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('create a new user account', async ({ client, route }) => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      username: 'Test User',
    }

    /**
     * Aktifkan mode fake mail
     */
    const { mails } = mail.fake()

    await client.post(route('register.store')).form(userData)

    mails.assertSent(VerifyEmailNotification, ({ message }) => {
      return (
        message.hasTo(userData.email) &&
        message.hasSubject('Verify your email address')
      )
    })

    mail.restore()
  })
})
