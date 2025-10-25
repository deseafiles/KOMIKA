import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  hasMany,
  column,
  beforeCreate,
  beforeUpdate,
  afterCreate,
  afterUpdate,
  beforeSave,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Comic from './comic.js'
import Page from './page.js'
import Purchase from './purchase.js'
import string from '@adonisjs/core/helpers/string'

export default class Episode extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare comicId: number

  @column()
  declare title: string | null

  @column()
  declare slug: string

  @column()
  declare episodeNumber: number

  @column()
  declare thumbnailUrl: string

  @column()
  declare coinPrice: number

  @column()
  declare isPremium: boolean

  @column()
  declare isPublished: boolean

  @column.dateTime()
  declare publishedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Comic, {
    foreignKey: 'comicId',
  })
  declare comics: BelongsTo<typeof Comic>

  @hasMany(() => Purchase, {
    foreignKey: 'episodeId',
  })
  declare purchases: HasMany<typeof Purchase>

  @hasMany(() => Page, {
    foreignKey: 'episodeId',
  })
  declare pages: HasMany<typeof Page>

  /*many to many
   * purchase, comment,
   */
  @beforeCreate()
  @beforeUpdate()
  static async slugify(episode: Episode) {
    if (episode.slug) return
    const slug = string.slug(episode.title, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const rows = await Episode.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (!rows.length) {
      episode.slug = slug
      return
    }

    const incrementors = rows.reduce<number[]>((result, row) => {
      const tokens = row.slug.toLowerCase().split(`${slug}-`)

      if (tokens.length < 2) {
        return result
      }

      const increment = Number(tokens.at(1))

      if (!Number.isNaN(increment)) {
        result.push(increment)
      }

      return result
    }, [])
    const increment = incrementors.length ? Math.max(...incrementors) + 1 : 1
    episode.slug = `${slug}-${increment}`
  }

  @beforeSave()
  static async changePremiumEpisode(episode: Episode) {
    episode.isPremium = episode.coinPrice > 0
  }

  @beforeSave()
  static async changeIsPublish(episode: Episode) {
    if (!episode.publishedAt) return

    const now = DateTime.now()

    const publishedUtc = episode.publishedAt.toUTC()
    const diffInSeconds = Math.abs(now.toUTC().diff(publishedUtc, 'seconds').seconds)

    if (diffInSeconds < 5) {
      episode.isPremium = true
    }
  }
}
