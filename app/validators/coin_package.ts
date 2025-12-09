import vine from '@vinejs/vine'

export const createCoinPackageValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(15),
    coinAmount: vine.number(),
    price: vine.number(),
    bonusCoin: vine.number().optional()
  })
)
