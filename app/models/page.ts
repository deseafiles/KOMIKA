import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Episode from './episode.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare episodeId: number

  @column()
  declare pageNumber: number

  @column()
  declare imageUrl: string

  @column()
  declare imageWidth: number

  @column()
  declare imageHeight: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Episode, {
    foreignKey: 'episodeId',
  })
  declare episodes: BelongsTo<typeof Episode>
}
