import Creator from '#models/creator'
import Page from '#models/page'
import { createPagesValidator } from '#validators/page'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'

export default class PagesController {
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

      if (imageWidth && imageHeight && (imageWidth > 1000 || imageHeight > 2280)) {
        return response.badRequest(
          `Gambar ${image.clientName} terlalu besar (${imageWidth}x${imageHeight})`
        )
      }

      await sharp(tempPath).resize(800, 1280, { fit: 'inside' }).toFile(outputPath)

      const page = await Page.create({
        episodeId,
        pageNumber: pageNumber + index,
        imageUrl: `/storage/pages/${fileName}`,
        imageHeight,
        imageWidth
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

  /**
   * Edit individual record
   */
  async edit({ params, inertia, auth }: HttpContext) {
    const creator = await Creator.query().where('user_id', auth.user!.id).firstOrFail()

    const pages = await Page.query().where('episode_id', params.id).preload('episodes', (episodeQuery) => {
      episodeQuery.where('creator_id', creator.id)
    })
    .firstOrFail()

    return inertia.render('pages/edit',  { pages })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    const payload = request.only(['pageNumber', 'imageUrl'])

    await page.merge(payload).save()

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ response, params }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    await page.delete()

    return response.redirect().back()
  }
}

