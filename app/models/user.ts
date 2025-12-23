import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { afterCreate, BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Comment from './comment.js'
import CommentReport from './comment_report.js'
import UserWalet from './user_walet.js'
import Transaction from './transaction.js'
import Purchase from './purchase.js'
import Creator from './creator.js'
import Episode from './episode.js'
import Comic from './comic.js'

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

  //hapus isDelete
  @column()
  declare isDeleted: boolean

  @column()
  declare lastLoginAt: DateTime

  @column()
  declare isVerified: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

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

  @manyToMany(() => Episode, {
    pivotTable: 'purchases',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'episode_id',
  })
  declare purchasedEpisodes: ManyToMany<typeof Episode>

  @manyToMany(() => Episode, {
    pivotTable: 'episode_likes'
  })
  declare userLikes: ManyToMany<typeof Episode>

  @manyToMany(() => Episode, {
    pivotTable: 'episode_reads'
  })
  declare userReads: ManyToMany<typeof Episode>

  @manyToMany(() => Comic, {
    pivotTable: 'comic_ratings',
    pivotColumns: ['rating_value']
  })
  declare userRating: ManyToMany<typeof Comic>

  @manyToMany(() => Comic, {
    pivotTable: 'comic_favorites'
  })
  declare userFavorites: ManyToMany<typeof Comic>

  //wip relasi comment
  @manyToMany(() => Comment, {
    pivotTable: 'comment_likes'
  })
  declare userCommentLike: ManyToMany<typeof Comment>

  @afterCreate()
  static async createUserWallet(user: User) {
   if(user.isAdmin === false) {
    await UserWalet.firstOrCreate({
      userId: user.id,
      coinBalance: 0,
      totalSpent: 0,
      totalPurchased: 0,
      totalMoneySpent:0.
      })
    }
  }
}
