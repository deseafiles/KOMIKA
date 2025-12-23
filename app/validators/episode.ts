import vine from '@vinejs/vine'

export const createEpisodeValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(30),
    episodeNumber: vine.number().min(1),
    publishedAt: vine.string(),
    thumbnailUrl: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      }),
    coinPrice: vine.number().min(0),
  })
)

export const paginatorEpisode = vine.compile(
  vine.object({
    page: vine.number().positive().optional(),
    perPage: vine.number().min(5).max(30).optional()
  })
)


export const updateEpisodeValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(30).optional(),
    episodeNumber: vine.number().min(1).optional(), // integer positif
    publishedAt: vine.string().optional(),
    coinPrice: vine.number().min(0).optional(),
    thumbnailUrl: vine.file({
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }).optional(),
  })
)

