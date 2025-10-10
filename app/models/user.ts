import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Comment from './comment.js'
import CommentReport from './comment_report.js'
import UserWalet from './user_walet.js'
import Transaction from './transaction.js'
import Purchase from './purchase.js'
import ComicRating from './comic_rating.js'
import Creator from './creator.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isAdmin: boolean

  @column()
  declare isBanned: boolean

  @column()
  declare isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => ComicRating)
  declare comicRating: HasMany<typeof ComicRating>

  @hasMany(() => Comment, {
    foreignKey: 'userId',
  })
  declare comments: HasMany<typeof Comment>

  @hasMany(() => CommentReport, {
    foreignKey: 'userId',
  })
  declare senderId: HasMany<typeof CommentReport>

  @hasMany(() => CommentReport, {
    foreignKey: 'targetUserId',
  })
  declare target_user: HasMany<typeof CommentReport>

  @hasOne(() => UserWalet)
  declare userWallet: HasOne<typeof UserWalet>

  @hasOne(() => Creator)
  declare creator: HasOne<typeof Creator>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>
}
