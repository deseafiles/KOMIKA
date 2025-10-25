import Comic from '#models/comic'
import Creator from '#models/creator'
import Episode from '#models/episode'
import {createEpisodeValidator} from '#validators/episode'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

export default class EpisodesController {
  /**
   * Display a list of resource
  **/

  async index({ inertia, auth }: HttpContext) {
    const creator = await Creator
      .query()
      .where('user_id', auth.user!.id)
      .firstOrFail()

    const comic = await Comic
      .query()
      .where('creator_id', creator.id)
      .firstOrFail()

    const episodes = await Episode
      .query()
      .where('comic_id', comic.id)
      .preload('pages', (pagesQuery) => {
        pagesQuery.orderBy('page_number', 'asc')
      })

    return inertia.render('episode/index', { episodes })
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('episode/create')
  }
  //params.comicId
  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { comicId, title, episodeNumber, publishedAt, thumbnailUrl, coinPrice } =
      await request.validateUsing(createEpisodeValidator)

    await thumbnailUrl.move(app.makePath('storage/metadata/episode-comic'), {
      overwrite: false,
    })

    const episode = await Episode.create({
      comicId,
      title,
      episodeNumber,
      publishedAt:DateTime.fromJSDate(publishedAt) ,
      thumbnailUrl: `/storage/metadata/episode-comic/${thumbnailUrl.fileName}/${episodeNumber}`,
      coinPrice
    })

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Episode create successfully',
        data: episode,
      })
    }
    return response.redirect().back()
  }

  /**
   * Show individual record
   * pelajari lagi where where apa saja
  async show({ params, inertia, auth }: HttpContext) {
    const creator = await Creator.query().where('user_id', auth.user!.id).firstOrFail()

    const episode = await Episode.query()
          .where('id', params.id)
          .whereHas('comics', (comicQuery) => comicQuery.where('creator_id', creator.id))
          .preload('purchases')
          .preload('comics', (comicQuery) => {
          comicQuery.where('creator_id', creator.id)
      })
      .preload('pages')
      .firstOrFail()

    return inertia.render('episode/show', { episode })
  }
   */

  /**
   * Edit individual record
   */
  async edit({ params, inertia }: HttpContext) {
    const creator = await Creator.query().firstOrFail()

    const episode = await Episode.query()
      .where('id', params.id)
      .where('creator_id', creator.id)
      .firstOrFail()

    return inertia.render('episode/edit', { episode })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const episode = await Episode.findOrFail(params.id)

    const payload = request.only(['title', 'episodeNumber', 'thumbnailUrl', 'coinPrice', 'publishedAt'])

    await episode.merge(payload).save()

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const episode = await Episode.findOrFail(params.id)

    await episode.delete()

    return response.redirect().back()
  }
}
