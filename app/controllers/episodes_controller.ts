import type { HttpContext } from '@adonisjs/core/http'
import Episode from '#models/episode'
import Comic from '#models/comic'
import Creator from '#models/creator'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { createEpisodeValidator, paginatorEpisode } from '#validators/episode'

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
async index({ inertia, auth, params }: HttpContext) {
  // Ambil slug dari URL
  const { slug } = params

  // Ambil komik berdasarkan slug + milik creator yang sedang login
  const creator = await Creator
    .query()
    .where('user_id', auth.user!.id)
    .firstOrFail()

  const comic = await Comic
    .query()
    .where('slug', slug)
    .where('creator_id', creator.id)
    .preload('episodes', (q) => q.orderBy('episode_number', 'asc'))
    .firstOrFail()

  return inertia.render('episode/index', {
    comic: {
      id: comic.id,
      title: comic.title,
      slug: comic.slug,
    },
    episodes: comic.episodes.map((ep) => ({
      id: ep.id,
      title: ep.title,
      slug: ep.slug,
      episodeNumber: ep.episodeNumber,
      publishedAt: ep.publishedAt,
      isPublished: ep.isPublished,
      coinPrice: ep.coinPrice,
    })),
  })
}

  /**
   * Show form to create new episode
   * @creator
   */
  async create({ inertia, params }: HttpContext) {
    const comic = await Comic
                        .query()
                        .where('slug', params.slug)
                        .firstOrFail()
    return inertia.render('episode/create', { comic })
  }

  /**
   * Store new episode
   * @creator
   */
  async store({ request, response, params }: HttpContext) {
    const {
      title,
      episodeNumber,
      publishedAt,
      thumbnailUrl,
      coinPrice,
    } = await request.validateUsing(createEpisodeValidator)

    const comic = await Comic.findByOrFail('slug', params.slug)

    await thumbnailUrl.move(app.makePath('storage/metadata/episode-comic'), {
      overwrite: true,
    })

    const publishedDate =  DateTime.fromISO(publishedAt)

    const episode = await Episode.create({
      title,
      episodeNumber,
      publishedAt: publishedDate,
      thumbnailUrl: `/storage/metadata/episode-comic/${thumbnailUrl.fileName}`,
      coinPrice,
      comicId: comic.id,
    })

    return response.redirect().toPath(`/episode/${comic.slug}/index`)
  }

  /**
   * Edit episode (creator only)
   */
async edit({ params, inertia, auth }: HttpContext) {
  // pastikan middleware auth() aktif
  const user = auth.user!

  // Ambil episode langsung berdasarkan slug
  const episode = await Episode
    .query()
    .where('slug', params.slug!) // slug harus ada
    .firstOrFail()

  return inertia.render('episode/edit', { episode })
}

async update({ params, request, response, auth }: HttpContext) {
  const episode = await Episode
    .query()
    .where('slug', params.slug!)
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
      .where('slug', params.slug)
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
async show({ params, inertia, auth, request }: HttpContext) {
  // const page = request.input('page', 1)
  // const perPage = 10
  // console.log('page', 'perPage')

  const  { page, perPage } = await request.validateUsing(paginatorEpisode)

  const episode = await Episode
    .query()
    .where('slug', params.episodeSlug)
    .where('is_published', true)
    .preload('comics', (q) => q.preload('comicGenres'))
    .firstOrFail()

  const pages = await episode
    .related('pages')
    .query()
    .orderBy('page_number', 'asc')
    .paginate(page ?? 1, perPage ?? 10)

  const user = auth.user

  if (episode.isPremium) {
    if (!user) {
      return inertia.render('episode/LockedEpisode', { episode, mustLogin: true })
    }

    const hasPurchased = await user
      .related('purchases')
      .query()
      .where('episode_id', episode.id)
      .first()

    if (!hasPurchased) {
      return inertia.render('episode/locked', { episode, purchased: false })
    }
  }


  if (user) {
    const read = await user
      .related('userReads')
      .query()
      .where('episode_id', episode.id)
      .first()

    if (!read) {
      await user.related('userReads').attach([episode.id])
    }
  }

  return inertia.render('episode/show', {
    episode: episode.toJSON(),
    pages: inertia.merge(() => pages.toJSON().data),
      pagesMeta: pages.getMeta()
  })
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
