import Creator from '#models/creator'
import Episode from '#models/episode'
import Page from '#models/page'
import { createPagesValidator } from '#validators/page'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'
import fs from 'node:fs/promises'

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
  if (!episodeSlug) {
    return response.badRequest('Episode tidak ditemukan di URL')
  }

  const episode = await Episode
    .query()
    .where('slug', episodeSlug)
    .firstOrFail()

  const lastPage = await Page.query()
    .where('episode_id', episode.id)
    .orderBy('page_number', 'desc')
    .first()

  let startNumber = lastPage ? lastPage.pageNumber + 1 : 1

  const imageFiles = request.files('imageUrl', {
    size: '2mb',
    extnames: ['jpg', 'png', 'jpeg', 'webp'],
  })

  const createdPages: Page[] = []

  for (const [index, image] of imageFiles.entries()) {
    if (!image.isValid) continue

    const cleanName = image.clientName
      .replace(/\s+/g, '_')
      .replace(/[^\w.-]/g, '')
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}_${cleanName}`

    const tempDir = app.makePath('tmp/uploads')
    await fs.mkdir(tempDir, { recursive: true })
    await image.move(tempDir, { name: fileName, overwrite: true })
    const tempPath = `${tempDir}/${fileName}`

    const outputDir = app.makePath('storage/pages-comic')
    await fs.mkdir(outputDir, { recursive: true })
    const outputPath = `${outputDir}/${fileName}`

    const metadata = await sharp(tempPath).metadata()
    const imageWidth = metadata.width
    const imageHeight = metadata.height

    if (imageWidth && imageHeight && (imageWidth > 1000 || imageHeight > 2280)) {
      return response.badRequest(
        `Gambar ${image.clientName} terlalu besar (${imageWidth}x${imageHeight})`
      )
    }

    await sharp(tempPath)
      .resize(800, 1280, { fit: 'inside' })
      .toFile(outputPath)

    await fs.unlink(tempPath)

    const page = await Page.create({
      episodeId: episode.id,
      pageNumber: startNumber + index,
      imageUrl: `/uploads/pages-comic/${fileName}`,
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

public async update({ request, response }: HttpContext) {
  const pagesData = request.input('pages') || []
  const files = request.files('pages') || []

  const outputDir = app.makePath('storage/pages-comic')
  await fs.mkdir(outputDir, { recursive: true })

  for (const updateData of pagesData) {
    const page = await Page.find(updateData.id)
    if (!page) continue

    page.pageNumber = updateData.pageNumber

    const file = files.find(f => f.clientName === updateData.fileName)
    if (file && file.isValid) {
      const cleanName = file.clientName
        .replace(/\s+/g, '_')
        .replace(/[^\w.-]/g, '')
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}_${cleanName}`

      const tempDir = app.makePath('tmp/uploads')
      await fs.mkdir(tempDir, { recursive: true })

      await file.move(tempDir, { name: fileName, overwrite: true })
      const tempPath = `${tempDir}/${fileName}`

      const metadata = await sharp(tempPath).metadata()
      const imageWidth = metadata.width
      const imageHeight = metadata.height

      if (imageWidth && imageHeight && (imageWidth > 1000 || imageHeight > 2280)) {
        await fs.unlink(tempPath)
        continue
      }

      const outputPath = `${outputDir}/${fileName}`
      await sharp(tempPath)
        .resize(800, 1280, { fit: 'inside' })
        .toFile(outputPath)

      await fs.unlink(tempPath)

      if (page.imageUrl) {
        const oldPath = app.makePath(page.imageUrl.replace('/uploads/', 'storage/'))
        try { await fs.unlink(oldPath) } catch {}
      }

      page.imageUrl = `/uploads/pages-comic/${fileName}`
      page.imageWidth = imageWidth
      page.imageHeight = imageHeight
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

