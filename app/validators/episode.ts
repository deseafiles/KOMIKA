import vine from '@vinejs/vine'

export const createEpisodeValidator = vine.compile(
  vine.object({
    comicId: vine.number(),
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
