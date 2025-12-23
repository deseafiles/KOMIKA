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

export const profileValidator = vine.compile(
  vine.object({
    bankName: vine.string().maxLength(30),
    bankAccountName: vine.string(),
    bankAccountNumber: vine.string().regex(/^[0-9]+$/).minLength(8).maxLength(20)
  })
)
