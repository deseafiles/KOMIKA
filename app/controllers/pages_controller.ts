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
      comicSlug: episode.comics.slug, // <- FIX
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

