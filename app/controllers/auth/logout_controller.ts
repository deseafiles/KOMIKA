import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class LogoutController {
  async handle({ auth, inertia, response }: HttpContext) {
    // Simpan user sekarang sebelum logout
    const user = auth.user

    // Update waktu terakhir login/logout
    if (user) {
      await user.merge({ lastLoginAt: DateTime.now() }).save()
    }

    // Logout
    await auth.use('web').logout()

    // Redirect berdasarkan role
    if (user?.isAdmin) {
      return response.redirect().toRoute('auth/login') // halaman login khusus admin
    } else {
      return inertia.location('/') // user biasa ke homepage
    }
  }
}
