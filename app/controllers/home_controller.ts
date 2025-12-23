import Comic from '#models/comic'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = 1

    const allComic = await Comic
      .query()
      .where('isDeleted', false)
      .preload('comicGenres', q => q.select(['id', 'name']))
      .preload('creators', q => q.preload('users'))
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)

    return inertia.render('home', { allComic: allComic.toJSON() })
  }

async savedComic({ inertia, auth, response }: HttpContext) {
  const user = auth.user

  if (!user) {
    return response.redirect('/login')
  }

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
  async banPage({ inertia }: HttpContext){
    return inertia.render('admin/UserManagement/BanPage')
  }
}
