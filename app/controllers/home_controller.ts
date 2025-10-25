import Comic from '#models/comic'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    // Ambil semua komik dan preload genre-nya
    const allComic = await Comic
      .query()
      .preload('comicGenres', (genreQuery) => {
        genreQuery.select(['id', 'name'])
      })
      .preload('creators')
      .orderBy('created_at', 'desc')

    return inertia.render('home', { allComic })
  }
}
