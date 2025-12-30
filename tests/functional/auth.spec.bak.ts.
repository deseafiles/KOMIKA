import { test } from '@japa/runner'
import mail from '@adonisjs/mail/services/main'
import VerifyEmailNotification from '#mails/verify_email_notification'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

test.group('Users | register', (group) => {
  group.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('create a new user account and send verification email', async ({
    client,
    route,
    assert,
  }) => {
    /**
     * Arrange
     */
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      username: 'Test User',
    }

    const { mails } = mail.fake()

    /**
     * Act
     */
    const response = await client
      .post(route('register.store'))
      .form(userData)

    /**
     * Assert HTTP
     */
    response.assertStatus(201)

    /**
     * Assert user created
     */
    const user = await User.findBy('email', userData.email)
    assert.exists(user)
    // assert.isNull(user!.emailVerifiedAt)
    //
    /**
     * Assert email sent
     */
    mails.assertSent(VerifyEmailNotification, ({ message }) => {
      return (
        message.hasTo(userData.email) &&
        message.hasSubject('Verify your email address')
      )
    })

    mail.restore()
  })
})
