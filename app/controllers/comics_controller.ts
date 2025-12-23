import Comic from '#models/comic'
import Creator from '#models/creator'
import Genre from '#models/genre'
import { CreatorService } from '#services/creator_service'
import { createComicValidator } from '#validators/comic'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs/promises'
import Drive from '@adonisjs/drive/services/main'

export default class ComicsController {
  /**
   * Display a list of resource
   * @creator
   */
async index({ inertia, auth }: HttpContext) {
  const creator = await Creator
    .query()
    .where('user_id', auth.user!.id)
    .firstOrFail()

  const listComicByCreator = await Comic
    .query()
    .where('creator_id', creator.id)
    .preload('comicGenres')

  return inertia.render('comic/index', {
    listComicByCreator: listComicByCreator.map(c => ({
      ...c.toJSON(),
      genres: c.comicGenres.map(g => g.name)   // kirim array nama genre
    })),
    creator,
  })
}

  /**
   * Display form to create a new record
   * @creator
   */
async create({ inertia }: HttpContext) {
  const genres = await Genre.query().select(['id', 'name'])
  return inertia.render('comic/create', { genres })
}

  /**
   * Handle form submission for the create action
   * @creator
   */
public async store({ request, response, auth }: HttpContext) {
    const { title, description, genreIds } = await request.validateUsing(
      createComicValidator
    )

    let coverPath: string | null = null
    const cover = request.file('coverUrl', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    if (cover) {
      if (!cover.isValid) {
        return response.badRequest({ errors: cover.errors })
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${cover.extname}`

      await cover.move(app.makePath('storage/covers'), {
        name: fileName,
      })

      coverPath = `/uploads/covers/${fileName}`
    }

    const creator = await CreatorService.createCreatorIfNotExist(auth.user!)
    const comic = await Comic.create({
      creatorId: creator.id,
      title,
      description,
      coverUrl: coverPath,
    })

    if (genreIds && genreIds.length > 0) {
      await comic.related('comicGenres').attach(genreIds)
    }

    if (request.accepts(['json'])) {
      return response.created({
        message: 'Comic created successfully',
        data: comic,
      })
    }

    return response.redirect().toRoute('/comic/index')
  }

//   public async showCoverImage({ response, params }: HttpContextContracR) {
//     const filePath = app.makePath('storage/covers', params.fileName)
//     return response.download(filePath)
//   }
// }
  /**
   * Show individual record
   * ini yang pas kita pencet 1 comic bakal nampilin detail comicnya
   * return detail comic, jumlah like, jumlah pembaca, episode
   * @all Users
   */
async show({ params, inertia, auth }: HttpContext) {
  const user = auth.user

  const comic = await Comic.query()
    .where('slug', params.slug)
    .preload('episodes', q => q.where('isPublished', true))
    .preload('comicGenres')
    .preload('comicFavorites', q => user ? q.wherePivot('user_id', user.id) : q)
    .preload('comicRatings', q => user ? q.wherePivot('user_id', user.id) : q)
    .firstOrFail()

const userRating = user
  ? await db
      .from('comic_ratings')
      .where('comic_id', comic.id)
      .andWhere('user_id', user.id)
      .first()
      .then(r => r?.rating_value ?? 0)
  : 0

  return inertia.render('comic/show', {
    comic: {
      ...comic.serialize(),
      isFavorited: comic.comicFavorites.length > 0,
      userRating,
    },
  })
}
  /**
   * Edit individual record
   * @creator
   */

async edit({ params, inertia, auth }: HttpContext) {
  const creator = await Creator
    .query()
    .where('user_id', auth.user!.id)
    .firstOrFail()

  const comic = await Comic
    .query()
    .where('slug', params.slug)
    .where('creator_id', creator.id)
    .preload('comicGenres') // jika nama relasinya ini
    .firstOrFail()

  // Ambil semua genre untuk select
  const genres = await Genre.all()

  return inertia.render('comic/edit', {
    comic: {
      ...comic.toJSON(),
      genreIds: comic.comicGenres.map(g => g.id), // array id genre
    },
    genres: genres.map(g => g.toJSON()), // kirim plain object
  })
}
  /**
   * Handle form submission for the edit action
   * @creator
  */

async update({ params, response, request, auth }: HttpContext) {
  const creator = await Creator
    .query()
    .where('user_id', auth.user!.id)
    .firstOrFail()

  const comic = await Comic
    .query()
    .where('slug', params.slug)
    .where('creator_id', creator.id)
    .firstOrFail()

  const payload = request.only([
    'title',
    'description',
    'status',
    'updateDay',
    'coverUrl'
  ])

  const genreIds = request.input('genreIds') ?? []

  const cover = request.file('cover', {
    size: '4mb',
    extnames: ['jpg', 'png', 'jpeg', 'webp'],
  })

  if (cover) {
    if (!cover.isValid) {
      return response.badRequest({ errors: cover.errors })
    }

    const fileName = `${Date.now()}.${cover.extname}`

    await cover.move(
      app.makePath('storage/covers'),
      { name: fileName }
    )

    if (comic.coverUrl) {
      const oldPath = app.makePath(comic.coverUrl.replace('/storage/', 'storage/'))
      try {
        await fs.unlink(oldPath)
      } catch {
      }
    }

    payload.coverUrl = `/uploads/covers/${fileName}`
  }

  comic.merge(payload)
  await comic.save()

  await comic.related('comicGenres').sync(genreIds)

  return response.redirect().toRoute('/comic/index')
}

  /**
   * Delete record
   * @creator
   */
  async destroy({ params, response, auth }: HttpContext) {
    const creator = await Creator.query().where('user_id', auth.user!.id).firstOrFail()

    const comic = await Comic.query().where('slug', params.slug).where('creator_id', creator.id).firstOrFail()

    await comic.delete()

    return response.redirect().back()
  }

async rate({ params, auth, request, response }: HttpContext) {
  const user = auth.user!
  const comic = await Comic.query().where('slug', params.slug).firstOrFail()

  const ratingValue = Number(request.input('rating_value'))

  if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
    return response.badRequest()
  }

  await user.related('userRating').sync(
    { [comic.id]: { rating_value: ratingValue } },
    false
  )

  return response.redirect().back()
}

async favorite({ params, auth, response }: HttpContext) {
  const user = auth.user!

  // cari komik berdasarkan slug
  const comic = await Comic.query().where('slug', params.slug).firstOrFail()

  // cek apakah user sudah favorite
  const favorite = await user
    .related('userFavorites')
    .query()
    .where('comic_id', comic.id)
    .first()

  if (favorite) {
    await user.related('userFavorites').detach([comic.id])
  } else {
    await user.related('userFavorites').attach([comic.id])
  }

  return response.redirect().back()
}
}
