import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Episode from './episode.js'
import CommentReport from './comment_report.js'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare episodeId: number

  @column()
  declare parentCommentId: number

  @column()
  declare content: string

  @column()
  declare isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare users: BelongsTo<typeof User>

  @belongsTo(() => Episode, {
    foreignKey: 'episodeId',
  })
  declare episodes: BelongsTo<typeof Episode>

  @hasMany(() => CommentReport, {
    foreignKey: 'commentId',
  })
  declare comment_reports: HasMany<typeof CommentReport>
}
