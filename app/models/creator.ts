import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Comic from './comic.js'

export default class Creator extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id'})
  declare userId: number | null

  @column()
  declare totalEarning: number

  @column()
  declare withdrawnBalance: number

  @column()
  declare bankName: string | null

  @column()
  declare bankAccountName: string | null

  @column()
  declare bankAccountNumber: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare users: BelongsTo<typeof User>

  @hasMany(() => Comic)
  declare comics: HasMany<typeof Comic>
}
