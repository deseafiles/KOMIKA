import vine from '@vinejs/vine'

export const createGenreValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(20),
  })
)

