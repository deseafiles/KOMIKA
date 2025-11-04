import vine from '@vinejs/vine'


export const createCommentValidator = vine.compile(
  vine.object({
    episodeId: vine.number(),
    parentCommentId: vine.number(),
    content: vine.string().maxLength(255)
  })
)


