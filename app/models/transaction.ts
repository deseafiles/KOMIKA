import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import CoinPackage from './coin_package.js'

//mencatat pembelian coin, berhubungan dengan midtrans
export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare coinPackageId: number

  @column()
  declare orderId: string

  @column()
  declare coinReceived: number

  @column()
  declare status: string

  @column()
  declare isPaid: boolean

  @column.dateTime()
  declare paidAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare users: BelongsTo<typeof User>

  @belongsTo(() => CoinPackage, {
    foreignKey: 'coinPackageId',
  })
  declare coinPackages: BelongsTo<typeof CoinPackage>
}

