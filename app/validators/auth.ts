import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    username: vine.string().maxLength(30),
    password: vine.string().minLength(8),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string().maxLength(30),
    password: vine.string().minLength(8),
  })
)

export const creatorRegisterValidator = vine.compile(
  vine.object({
    username: vine.string().maxLength(30),
    password: vine.string().minLength(8),
  })
)
