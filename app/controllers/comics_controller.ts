import Comic from '#models/comic'
import Creator from '#models/creator'
import Genre from '#models/genre'
import { CreatorService } from '#services/creator_service'
import { createComicValidator } from '#validators/comic'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

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
      genres: c.comicGenres.map(g => g.name)
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
  async store({ request, response, auth }: HttpContext) {
    const { title, description, genreIds } = await request.validateUsing(createComicValidator)

    //buat pengecekan creator udah ada atau engga, kalo engga buat creator baru, kalo udah ada langsung buat komiknya aja
    const coverUrl = request.file('coverUrl', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    let coverPath: string | null = null
    if (coverUrl && coverUrl.isValid) {
      await coverUrl.move(app.makePath('storage/metadata/coverUrl'))
      coverPath = `/storage/metadata/coverUrl/${coverUrl.fileName}`
    } else if (coverUrl && !coverUrl.isValid) {
      return response.badRequest({ errors: coverUrl.errors })
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
      return response.ok({
        message: 'Comic created successfully',
        data: comic,
        genreIds
      })
    }

    return response.redirect().toRoute('/comic/index')
  }

  async showCoverImage({ response, params }: HttpContext) {
    return response.download(app.makePath('storage/coverUrl', params.fileName))
  }
  /**
   * Show individual record
   * ini yang pas kita pencet 1 comic bakal nampilin detail comicnya
   * return detail comic, jumlah like, jumlah pembaca, episode
   * @all Users
   */
  async show({ params, inertia  }: HttpContext) {
    const comic = await Comic
                       .query()
                       .where('slug', params.slug)
                       .preload('episodes', episodeQuery => {
                         episodeQuery.where('isPublished', true)
                        .orderBy('episodeNumber', 'asc')

                       })
                       .preload('creators')
                       .preload('comicGenres')
                       .preload('comicRatings')
                       .preload('comicFavorites')
                       .firstOrFail()

    return inertia.render('comic/show', { comic })
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

  // Ambil field
  const payload = request.only([
    'title',
    'description',
    'status',
    'updateDay'
  ])

  const genreIds = request.input('genreIds') || []

  const cover = request.file('cover', {
    size: '4mb',
    extnames: ['jpg', 'png', 'jpeg', 'webp'],
  })

  if (cover) {
    const fileName = `${Date.now()}.${cover.extname}`
    await cover.move('uploads/comics', { name: fileName })
    payload.coverUrl = `/uploads/comics/${fileName}`
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
    return response.badRequest({ message: 'Invalid rating value (0–5)' })
  }

  // cek apakah user sudah pernah kasih rating
  const existing = await user
    .related('userRating')
    .query()
    .where('comic_id', comic.id)
    .first()

  if (existing) {
    // update rating di pivot
    await user.related('userRating').sync(
      { [comic.id]: { rating_value: ratingValue } },
      false // false artinya jangan detach data lain
    )
  } else {
    // buat rating baru
    await user.related('userRating').attach({
      [comic.id]: { rating_value: ratingValue },
    })
  }

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
