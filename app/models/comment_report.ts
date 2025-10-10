import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Comment from './comment.js'

export default class CommentReport extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare targetUserId: number

  @column()
  declare commentId: number

  @column()
  declare reason: string

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'targetUserId',
  })
  declare target_user: BelongsTo<typeof User>

  @belongsTo(() => Comment, {
    foreignKey: 'commentId',
  })
  declare comments: BelongsTo<typeof Comment>
}
