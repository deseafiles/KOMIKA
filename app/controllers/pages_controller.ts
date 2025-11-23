import Creator from '#models/creator'
import Episode from '#models/episode'
import Page from '#models/page'
import { createPagesValidator } from '#validators/page'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'

export default class PagesController {
  /**
   * Display form to create a new record
   */
async create({ inertia, params }: HttpContext) {
  const episode = await Episode
    .query()
    .where('slug', params.episodeSlug)
    .whereHas('comics', q => q.where('slug', params.comicSlug))
    .preload('comics')
    .firstOrFail()

  return inertia.render('page/create', {
    episode: {
      id: episode.id,
      slug: episode.slug,
      episodeNumber: episode.episodeNumber,
      comicId: episode.comicId,
      comicSlug: episode.comics.slug,
      episodeSlug: episode.slug,
    }
  })
}

  /**
   * Handle form submission for the create action
   */
async store({ request, response, params }: HttpContext) {
  const episodeSlug = params.episodeSlug
  const episode = await Episode
    .query()
    .where('slug', params.episodeSlug)
    .firstOrFail()

  if (!episodeSlug) {
    return response.badRequest('Episode tidak ditemukan di URL')
  }

 // const { pageNumber } = await request.validateUsing(createPagesValidator)

  const lastPage = await Page.query()
    .where('episode_id', episode.id)
    .orderBy('page_number', 'desc')
    .first()

  let startNumber = lastPage ? lastPage.pageNumber + 1 : 1

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
      overwrite: true,
    })

    const outputPath = app.makePath(`storage/pages-comic/${fileName}`)
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
      episodeId: episode.id,
      pageNumber: startNumber + index,
      imageUrl: `/storage/pages-comic/${fileName}`,
      imageHeight,
      imageWidth,
    })

    createdPages.push(page)
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
  const user = auth.user!
  const creator = await Creator.query().where('user_id', user.id).firstOrFail()

  const episode = await Episode.findOrFail(params.episodeId)

  const pages = await Page.query()
    .where('episode_id', episode.id)
    .preload('episodes', (q) => {
      q.preload('comics', (c) => {
        c.where('creator_id', creator.id)
      })
    })

  return inertia.render('page/edit', {
    episode: episode.toJSON(),
    pages: pages.map(p => p.toJSON()),
  })
}
public async update({ params, request, response }: HttpContextContract) {
    const pagesData = request.input('pages') || []
    const files = request.files('pages')

    for (const updateData of pagesData) {
      const page = await Page.find(updateData.id)
      if (!page) continue

      page.pageNumber = updateData.pageNumber

      const file = files.find(f => f.clientName === updateData.fileName)
      if (file) {
        await file.move(Application.makePath('storage/pages'), {
          name: `${Date.now()}-${file.clientName}`,
          overwrite: true,
        })
        page.imageUrl = `/storage/pages/${file.clientName}`
      }

      await page.save()
    }

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

