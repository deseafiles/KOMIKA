import Comic from '#models/comic'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ inertia }: HttpContext) {
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

async savedComic({ inertia, auth }: HttpContext) {
  const user = auth.user!

  const favoriteComic = await Comic
    .query()
    .join('comic_favorites', 'comic_favorites.comic_id', 'comics.id')
    .where('comic_favorites.user_id', user.id)
    .preload('comicGenres')
    .preload('creators', creatorQuery => {
      creatorQuery.preload('users')
    })
    .orderBy('comics.title', 'asc')

  return inertia.render('library', { favoriteComic })
}

async search({ request, inertia }: HttpContext) {
  const keyword = request.input('q', '').trim()

  const comics = await Comic
    .query()
    .where((query) => {
      query
        .where('title', 'like', `%${keyword}%`)
        .orWhereHas('creators', (creatorQuery) => {
          creatorQuery.whereHas('users', (userQuery) => {
            userQuery.where('username', 'like', `%${keyword}%`)
          })
        })
        .orWhereHas('comicGenres', (genreQuery) => {
          genreQuery.where('name', 'like', `%${keyword}%`)
        })
    })
    .preload('comicGenres')
    .preload('creators', (q) => q.preload('users'))
    .orderBy('title', 'asc')

  return inertia.render('search', {
    keyword,
    comics,
  })
}

}
