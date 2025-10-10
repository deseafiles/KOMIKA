import Comic from '#models/comic'
import { CreatorService } from '#services/creator_service'
import { createComicValidator } from '#validators/comic'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ComicsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, response }: HttpContext) {
    if (app.inTest) return response.ok({ message: 'Page Loaded' })
    return inertia.render('home')
  }

  /**
   * Display form to create a new record
   */
  async create({ response, inertia }: HttpContext) {
    if (app.inTest) return response.ok({ message: 'Page Loaded' })
    return inertia.render('test/comic/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth, inertia }: HttpContext) {
    const { title, description } = await request.validateUsing(createComicValidator)

    //buat pengecekan creator udah ada atau engga, kalo engga buat creator baru, kalo udah ada langsung buat komiknya aja
    const coverUrl = request.file('coverUrl', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    let coverPath: string | null = null
    if (coverUrl && coverUrl.isValid) {
      await coverUrl.move(app.makePath('storage/metadata'))
      coverPath = `/cover-url/${coverUrl.fileName}`
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

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Comic created successfully',
        data: comic,
      })
    }

    if (app.inTest) {
      return response.json({ message: 'Comic created successfully', data: comic })
    }

    return inertia.render('test/comic/store')
  }

  async showCoverImage({ response, params }: HttpContext) {
    return response.download(app.makePath('storage/coverUrl', params.fileName))
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

  async update({ params, request, response }: HttpContext) {
    if (app.inTest) return response.ok({ message: 'Page Loaded' })

    const comic
    return inertia.render('/test/comic/update')
  }
  */

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
