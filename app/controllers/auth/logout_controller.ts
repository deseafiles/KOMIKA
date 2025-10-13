import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class LogoutController {
  async handle({ auth, response }: HttpContext) {
    await auth.user?.merge({ lastLoginAt: DateTime.now() }).save()
    await auth.use('web').logout()

    return response.ok('User logged out')
  }
}
