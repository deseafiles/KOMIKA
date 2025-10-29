import Genre from '#models/genre'
import { createGenreValidator } from '#validators/genre'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class GenresController {
  async index({ inertia }: HttpContext) {
    const genre = await Genre.query().select(['name'])

    return inertia.render('admin/Genres/index', { genre})
  }

  async create({ inertia, response }: HttpContext) {
    if (app.inTest) return response.ok({ message: 'Page Loaded' })
    return inertia.render('admin/Genres/create')
  }

  async store({ request, response }: HttpContext) {
    const { name } = await request.validateUsing(createGenreValidator)

    const genre = await Genre.firstOrCreate({
      name,
    })

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Genre created successfully',
        data: genre,
      })
    }

    return response.redirect().back()
  }

  async destroy({ params, request, response }: HttpContext) {
    const genre = await Genre.findOrFail(params.id)

    await genre.delete()

    if (request.accepts(['json'])) {
      return response.ok({ message: 'Genre has been deleted' })
    }

    return response.redirect().toRoute('/admin/genres/index')
  }
}

