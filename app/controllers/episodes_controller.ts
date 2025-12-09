import type { HttpContext } from '@adonisjs/core/http'
import Episode from '#models/episode'
import Comic from '#models/comic'
import Creator from '#models/creator'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { createEpisodeValidator, paginatorEpisode } from '#validators/episode'
import ComicPolicy from '#policies/comic_policy'

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
   * @creator
   */
  async edit({ params, inertia, auth, bouncer, response }: HttpContext) {
    const episode = await Episode
      .query()
      .where('slug', params.slug!)
      .preload('comics')
      .firstOrFail()

    try {
      await bouncer.with('ComicPolicy').authorize('edit', episode)
    } catch (error) {
      return response.forbidden('Anda tidak bisa edit episode ini')
    }

    return inertia.render('episode/edit', { episode })
  }

  /**
   * Update episode (creator only)
   * @creator
   */
async update({ params, request, response, auth, bouncer }: HttpContext) {
  const comic = await Comic.findByOrFail('slug', params.slug)

  const episode = await Episode
    .query()
    .where('slug', params.episodeSlug!)
    .preload('comics')
    .firstOrFail()

  try {
    await bouncer.with('ComicPolicy').authorize('edit', episode)
  } catch (error) {
    return response.forbidden('Anda tidak bisa edit episode ini')
  }

const payload = request.only([
  'title',
  'episodeNumber',
  'coinPrice',
  'publishedAt',
])

if (payload.publishedAt) {
  payload.publishedAt = DateTime.fromISO(payload.publishedAt)
}


  const thumbnailUrl = request.file('thumbnailUrl', {
    size: '5mb',
    extnames: ['jpg', 'png', 'jpeg', 'webp'],
  })

  if (thumbnailUrl && thumbnailUrl.isValid) {
    await thumbnailUrl.move(app.makePath('storage/metadata/episode-comic'), {
      overwrite: true,
    })
    episode.thumbnailUrl = `/storage/metadata/episode-comic/${thumbnailUrl.fileName}`
  }
  else if (thumbnailUrl && !thumbnailUrl.isValid) {
    return response.badRequest({ errors: thumbnailUrl.errors })
  }

  await episode.merge(payload).save()

  return response.redirect().toPath(`/episode/${comic.slug}/index`)
}

  /**
   * Delete episode (creator only)
   * @creator
   */
  async destroy({ params, response, auth, bouncer }: HttpContext) {
    const episode = await Episode
      .query()
      .where('slug', params.slug)
      .preload('comics')
      .firstOrFail()

    // Gunakan policy untuk cek apakah user pembuat komik
    try {
      await bouncer.with('ComicPolicy').authorize('delete', episode)
    } catch (error) {
      return response.forbidden('Anda tidak bisa delete episode ini')
    }

    await episode.delete()

    return response.redirect().back()
  }

  /**
   * =============================
   * READER SECTION
   * =============================
   */

  /**
   * List all published episodes for a specific comic
   * (used in public reader view)
   */
  async listByComic({ params, inertia }: HttpContext) {
    const comic = await Comic
      .query()
      .where('slug', params.slug)
      .preload('comicGenres')
      .firstOrFail()

    const episodes = await Episode
      .query()
      .where('comic_id', comic.id)
      .where('isPublished', true)
      .orderBy('episode_number', 'asc')
      .preload('pages', (pagesQuery) => {
        pagesQuery.orderBy('page_number', 'asc')
      })

    return inertia.render('episode/list', { comic, episodes })
  }

  /**
   * Show single published episode to reader
   * Gunakan policy untuk akses kontrol
   */
  async show({ params, inertia, auth, request, bouncer }: HttpContext) {
    const { page, perPage } = await request.validateUsing(paginatorEpisode)

    const episode = await Episode
      .query()
      .where('slug', params.episodeSlug)
      .where('is_published', true)
      .preload('comics', (q) => q.preload('comicGenres').preload('creators'))
      .firstOrFail()

    const user = auth.user

    // Gunakan policy untuk cek akses episode (berbayar atau gratis)
    try {
      await bouncer.with('ComicPolicy').authorize('view', episode)
    } catch (error) {
      // Jika tidak bisa akses dan episode premium
      if (episode.isPremium) {
        if (!user) {
          return inertia.render('episode/show', {
            episode: episode.toJSON(),
            pages: [],
            pagesMeta: {},
            showPurchaseModal: true,
            mustLogin: true,
          })
        }

        // User sudah login tapi belum beli
        return inertia.render('episode/show', {
          episode: episode.toJSON(),
          pages: [],
          pagesMeta: {},
          showPurchaseModal: true,
          purchased: false,
        })
      }
    }

    // Jika user login dan episode gratis/sudah dibeli, track read
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

    // Load pages dengan pagination
    const pages = await episode
      .related('pages')
      .query()
      .orderBy('page_number', 'asc')
      .paginate(page ?? 1, perPage ?? 10)

    return inertia.render('episode/show', {
      episode: episode.toJSON(),
      pages: inertia.merge(() => pages.toJSON().data),
      pagesMeta: pages.getMeta(),
      showPurchaseModal: false,
    })
  }

  /**
   * Like episode
   */
  async likeEpisode({ params, auth, response }: HttpContext) {
    const user = auth.user!

    const like = await user
      .related('userLikes')
      .query()
      .where('episode_id', params.id)
      .first()

    if (like) {
      await user.related('userLikes').detach([params.id])
    } else {
      await user.related('userLikes').attach([params.id])
    }

    return response.redirect().back()
  }
}
