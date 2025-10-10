import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Episode from './episode.js'
import Creator from './creator.js'

/*
 * This model is using for
 * transaction when user want to
 * buy an episode
 */
export default class Purchase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare episodeId: number

  @column()
  declare creatorId: number

  @column()
  declare coinSpent: number

  @column()
  declare platformShare: number

  @column()
  declare creatorShare: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare users: BelongsTo<typeof User>

  @belongsTo(() => Episode, {
    foreignKey: 'episodeId',
  })
  declare episodes: BelongsTo<typeof Episode>

  @belongsTo(() => Creator, {
    foreignKey: 'creatorId',
  })
  declare creators: BelongsTo<typeof Creator>
}

