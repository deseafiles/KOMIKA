import vine from '@vinejs/vine'

export const createComicValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(30),
    description: vine.string().minLength(10).maxLength(250),
    genreIds: vine.array(vine.number()),
  })
)

