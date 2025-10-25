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
      size: '2mb',
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
    await comic.related('comicGenres').attach(genreIds)

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
                       .where('id', params.id)
                       .preload('episodes', episodeQuery => {
                         episodeQuery.where('id', params.id)
                         .orderBy('episodeNumber', 'asc')
                       })
                       .preload('creators')
                       .firstOrFail()

    return inertia.render('comic/show', { comic })
  }
  /**
   * Edit individual record
   */

async edit({ params, inertia }: HttpContext) {
  const creator = await Creator.query().firstOrFail()

  const comic = await Comic.query()
    .where('id', params.id)
    .where('creator_id', creator.id)
    .firstOrFail()

  return inertia.render('comic/edit', { comic })
}
  /**
   * Handle form submission for the edit action
  */

  async update({ params, response, request }: HttpContext) {
    const comic = await Comic.findOrFail(params.id)

    const payload = request.only(['title', 'description', 'status', 'coverUrl', 'updateDay'])

    await comic.merge(payload).save()

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const comic = await Comic.findOrFail(params.id)

    await comic.delete()

    return response.redirect().back()
  }
}
