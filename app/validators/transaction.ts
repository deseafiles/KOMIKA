import vine from '@vinejs/vine'

export const createTransactionCoin = vine.compile(
  vine.object({
    coinPackageId: vine.number()
  })
)
