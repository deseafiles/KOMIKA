import vine from '@vinejs/vine'

export const createEpisodeValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(30).optional(),
    episodeNumber: vine.number(),
    publishedAt: vine.string(),
    thumbnailUrl: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      }),
    coinPrice: vine.number()
  })
)

export const paginatorEpisode = vine.compile(
  vine.object({
    page: vine.number().positive().optional(),
    perPage: vine.number().min(5).max(30).optional()
  })
)
