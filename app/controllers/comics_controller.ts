import Comic from '#models/comic'
import Creator from '#models/creator'
import { CreatorService } from '#services/creator_service'
import { createComicValidator } from '#validators/comic'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ComicsController {
  /**
   * Display a list of resource
   */
async index({ inertia, auth }: HttpContext) {
  const creator = await Creator.query().where('user_id', auth.user!.id).firstOrFail()

  const listComicByCreator = await Comic.query().where('creator_id', creator.id)
  return inertia.render('comic/index', { listComicByCreator })
}

  /**
   * Display form to create a new record
   */
  async create({ response, inertia }: HttpContext) {
    if (app.inTest) return response.ok({ message: 'Page Loaded' })
    return inertia.render('comic/create')
  }

  /**
   * Handle form submission for the create action
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
   */
  async show({ params, inertia  }: HttpContext) {
    const comic = await Comic
                       .query()
                       .where('slug', params.slug)
                       .preload('episodes', episodeQuery => {
                         episodeQuery.orderBy('episodeNumber', 'asc')
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
   */

async edit({ params, inertia, auth }: HttpContext) {
  const creator = await Creator.query().where('user_id', auth.user!.id).firstOrFail()

  const comic = await Comic.query()
    .where('slug', params.slug)
    .where('creator_id', creator.id)
    .firstOrFail()

  return inertia.render('comic/edit', { comic })
}
  /**
   * Handle form submission for the edit action
  */

  async update({ params, response, request, auth }: HttpContext) {
    const creator = await Creator.query().where('user_id', auth.user!.id).firstOrFail()

    const comic = await Comic.query().where('slug', params.slug).where('creator_id', creator.id).firstOrFail()

    const payload = request.only(['title', 'description', 'status', 'coverUrl', 'updateDay'])

    await comic.merge(payload).save()

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, auth }: HttpContext) {
    const creator = await Creator.query().where('user_id', auth.user!.id).firstOrFail()

    const comic = await Comic.query().where('slug', params.slug).where('creator_id', creator.id).firstOrFail()

    await comic.delete()

    return response.redirect().back()
  }

async rate({ params, auth, request, response }: HttpContext) {
  const user = auth.user!
  const ratingValue = Number(request.input('rating_value'))

  if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
    return response.badRequest({ message: 'Invalid rating value (0–5)' })
  }

  // cek apakah user sudah pernah kasih rating
  const existing = await user
    .related('userRating')
    .query()
    .where('comic_id', params.id)
    .first()

  if (existing) {
    // update rating di pivot
    await user.related('userRating').sync({
      [params.id]: { rating_value: ratingValue },
    }, false) // false artinya jangan detach data lain
  } else {
    // buat rating baru
    await user.related('userRating').attach({
      [params.id]: { rating_value: ratingValue },
    })
  }

  return response.ok({ message: 'Rating saved successfully' })
}

  async favorite({ params, response, auth}: HttpContext){
    const user = auth.user!
    const favorite = await user.related('userFavorites').query().where('comic_id', params.id).first()

    if(favorite) {
      await user.related('userFavorites').detach([params.id])
    } else{
      await user.related('userFavorites').attach([params.id])
    }
  }

}
