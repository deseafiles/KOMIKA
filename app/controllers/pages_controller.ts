import Page from '#models/page'
import { createPagesValidator } from '#validators/comic'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'

export default class PagesController {
  /*
   *
   */
  async index({ inertia, response, request }: HttpContext) {
    const pages = await Page.query().orderBy('pageNumber', 'asc')

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Page Loaded',
        data: pages,
      })
    }
    return inertia.render('pages/index')
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
    return inertia.render('pages/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { episodeId, pageNumber } = await request.validateUsing(createPagesValidator)

    const imageFiles = request.files('imageUrl', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    const createdPages = []

    for (const [index, image] of imageFiles.entries()) {
      if (!image.isValid) continue

      const fileName = `${Date.now()}_${image.clientName}`

      const tempPath = app.makePath(`tmp/uploads/${fileName}`)
      await image.move(app.makePath('tmp/uploads'), {
        name: fileName,
        overwrite: false,
      })

      const outputPath = app.makePath(`storage/pages/${fileName}`)
      const metadata = await sharp(tempPath).metadata()
      const imageWidth = metadata.width
      const imageHeight = metadata.height

      if (imageWidth && imageHeight && (imageWidth > 800 || imageHeight > 1280)) {
        return response.badRequest(
          `Gambar ${image.clientName} terlalu besar (${imageWidth}x${imageHeight})`
        )
      }

      await sharp(tempPath).resize(800, 1280, { fit: 'inside' }).toFile(outputPath)

      const page = await Page.create({
        episodeId,
        pageNumber: pageNumber + index,
        imageUrl: `/pages/${fileName}`,
      })

      createdPages.push(page)
    }

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Pages created successfully',
        data: createdPages,
      })
    }

    return response.redirect().back()
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
  async destroy({ response }: HttpContext) {
    const deletedCount = await Page.query().delete()

    return response.ok({
      message: `All pages deleted successfully (${deletedCount} records)`,
    })
  }
}

