import Comic from '#models/comic'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class HomeController {
  async index({ inertia, response }: HttpContext) {
    if (app.inTest) return response.ok({ message: 'Page Loaded' })

    const allComic = await Comic
      .query()
      .preload('comicGenres', (genreQuery) => {
        genreQuery.select(['id', 'name'])
      })
      .preload('creators', (creatorQuery) => {
        creatorQuery.preload('users')
      })
      .orderBy('created_at', 'desc')

    return inertia.render('home', { allComic })
  }
}
