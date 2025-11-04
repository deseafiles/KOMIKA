import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsAdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    if (!auth.user) {
      return response.unauthorized({ message: 'Harus login terlebih dahulu.' })
    }

    if (!auth.user.isAdmin) {
      return response.forbidden({ message: 'Akses hanya untuk Admin.' })
    }

    await next()
  }
}

