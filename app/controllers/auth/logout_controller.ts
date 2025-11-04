import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class LogoutController {
  async handle({ auth, inertia }: HttpContext) {
    await auth.user?.merge({ lastLoginAt: DateTime.now() }).save()
    await auth.use('web').logout()
    return inertia.location('/')
  }
}
