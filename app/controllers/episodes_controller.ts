import Episode from '#models/episode'
import { createEpisodeValidator } from '#validators/comic'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

export default class EpisodesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, response, request }: HttpContext) {
    const episodes = await Episode.query().orderBy('episodeNumber', 'asc')

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Page Loaded',
        data: episodes,
      })
    }
    return inertia.render('episode/index')
  }

  /**
   * Display form to create a new record
   */
  async create({ response, inertia, request }: HttpContext) {
    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Page Loaded',
      })
    }
    return inertia.render('episode/create')
  }
  //params.comicId
  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { comicId, title, episodeNumber, publishedAt, thumbnailUrl } =
      await request.validateUsing(createEpisodeValidator)

    await thumbnailUrl.move(app.makePath('storage/metadata/episode-comic'), {
      overwrite: false,
    })

    const episode = await Episode.create({
      comicId,
      title,
      episodeNumber,
      publishedAt: DateTime.fromISO(publishedAt),
      thumbnailUrl: `/storage/metadata/episode-comic/${thumbnailUrl.fileName}/${episodeNumber}`,
    })

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Episode create successfully',
        data: episode,
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
