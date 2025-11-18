import vine from '@vinejs/vine'

export const createPagesValidator = vine.compile(
  vine.object({
    pageNumber: vine.number().min(1).max(45),
  })
)
