import type { HttpContext } from '@adonisjs/core/http'
import Episode from '#models/episode'
import Comic from '#models/comic'
import Creator from '#models/creator'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { createEpisodeValidator } from '#validators/episode'

export default class EpisodesController {
  /**
   * =============================
   * CREATOR SECTION
   * =============================
   */

  /**
   * Display all episodes belonging to creator
   * @creator
  */
  async index({ inertia, auth }: HttpContext) {
    const creator = await Creator
      .query()
      .where('user_id', auth.user!.id)
      .firstOrFail()

    // Ambil semua episode di komik milik creator
    const episodes = await Comic
      .query()
      .where('creator_id', creator.id)
      .preload('episodes', (episodesQuery) => {
        episodesQuery.orderBy('episode_number', 'asc')
      })

    return inertia.render('episode/index', { episodes })
  }

  /**
   * Show form to create new episode
   * @creator
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('episode/create')
  }

  /**
   * Store new episode
   * @creator
   */
  async store({ request, response }: HttpContext) {
    const {
      comicId,
      title,
      episodeNumber,
      publishedAt,
      thumbnailUrl,
      coinPrice,
    } = await request.validateUsing(createEpisodeValidator)

    await thumbnailUrl.move(app.makePath('storage/metadata/episode-comic'), {
      overwrite: false,
    })

    const publishedDate =  DateTime.fromISO(publishedAt)

    const episode = await Episode.create({
      comicId,
      title,
      episodeNumber,
      publishedAt: publishedDate,
      thumbnailUrl: `/storage/metadata/episode-comic/${thumbnailUrl.fileName}`,
      coinPrice,
    })

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Episode created successfully',
        data: episode,
      })
    }

    return response.redirect().back()
  }

  /**
   * Edit episode (creator only)
   */
  async edit({ params, inertia, auth }: HttpContext) {
    const creator = await Creator
      .query()
      .where('user_id', auth.user!.id)
      .firstOrFail()

    const episode = await Episode
      .query()
      .where('id', params.id)
      .whereHas('comics', (comicQuery) =>
        comicQuery.where('creator_id', creator.id)
      )
      .firstOrFail()

    return inertia.render('episode/edit', { episode })
  }

  /**
   * Update episode (creator only)
   */
  async update({ params, request, response, auth }: HttpContext) {
    const creator = await Creator
      .query()
      .where('user_id', auth.user!.id)
      .firstOrFail()

    const episode = await Episode
      .query()
      .where('id', params.id)
      .whereHas('comics', (comicQuery) =>
        comicQuery.where('creator_id', creator.id)
      )
      .firstOrFail()

    const payload = request.only([
      'title',
      'episodeNumber',
      'thumbnailUrl',
      'coinPrice',
      'publishedAt',
    ])

    await episode.merge(payload).save()

    return response.redirect().back()
  }

  /**
   * Delete episode (creator only)
   */
  async destroy({ params, response, auth }: HttpContext) {
    const creator = await Creator
      .query()
      .where('user_id', auth.user!.id)
      .firstOrFail()

    const episode = await Episode
      .query()
      .where('id', params.id)
      .whereHas('comics', (comicQuery) =>
        comicQuery.where('creator_id', creator.id)
      )
      .firstOrFail()

    await episode.delete()

    return response.redirect().back()
  }

  /**
   * =============================
   *READER SECTION
   * =============================
   */

  /**
   * List all published episodes for a specific comic
   * (used in public reader view)

  async listByComic({ params, inertia }: HttpContext) {
    const comic = await Comic
      .query()
      .where('slug', params.slug)
      .preload('comicGenres')
      .firstOrFail()

    const episodes = await Episode
      .query()
      .where('comic_id', comic.id)
      .where('isPublished', true) //ini pengecekannya kalau published at udah di tanggalnya
      .orderBy('episode_number', 'asc')
      .preload('pages', (pagesQuery) => {
        pagesQuery.orderBy('page_number', 'asc')
      })

    return inertia.render('episode/list', { comic, episodes })
  }

  /**
   * Show single published episode to reader
   */
async showPublic({ params, inertia, auth }: HttpContext) {
  // Ambil episode yang dipublikasikan
  const episode = await Episode
    .query()
    .where('id', params.id)
    .whereNotNull('published_at')
    .preload('pages', (pagesQuery) => pagesQuery.orderBy('page_number', 'asc'))
    .preload('comics', (comicQuery) => comicQuery.preload('comicGenres'))
    .firstOrFail()

  const user = auth.user
  if (user) {
    const read = await user.related('userReads').query().where('episode_id', params.id).first()

    if (!read) {
      await user.related('userReads').attach([params.id])
    }
  }

  return inertia.render('episode/show', { episode })
}

  async likeEpisode({ params, auth }: HttpContext) {
    const user = auth.user!
    const like = await user.related('userLikes').query().where('episode_id', params.id).first()

    if(like) {
      await user.related('userLikes').detach([params.id])
    } else {
      await user.related('userLikes').attach([params.id])
    }
  }

}
