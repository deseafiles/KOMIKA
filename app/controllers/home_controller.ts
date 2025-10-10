import Comic from '#models/comic'
import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ response, inertia, request }: HttpContext) {
    const allComic = await Comic.all()

    // Kalau testing (misal pakai Japa)
    if (app.inTest) {
      return response.ok({ message: allComic })
    }

    // Kalau request dari Postman / API
    if (request.accepts(['json'])) {
      return response.ok({
        message: 'All comics retrieved successfully',
        data: allComic,
      })
    }

    // Kalau request dari browser pakai Inertia
    return inertia.render('home', { comics: allComic })
  }
}

