import Comic from '#models/comic'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    const allComic = await Comic.all()

    return inertia.render('home', { allComic })
  }
}
