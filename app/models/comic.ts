import { DateTime } from 'luxon'
import {
  beforeCreate,
  beforeUpdate,
  BaseModel,
  column,
  belongsTo,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Episode from './episode.js'
import Creator from './creator.js'
import Genre from './genre.js'

export default class Comic extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare creatorId: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare coverUrl: string | null

  @column()
  declare status: string
  @column()
  declare updateDay: string

  @column()
  declare isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Creator)
  declare creators: BelongsTo<typeof Creator>

  @hasMany(() => Episode, {
    foreignKey: 'comicId',
  })
  declare episodes: HasMany<typeof Episode>

  @manyToMany(() => Genre, {
    pivotTable: 'comic_genres',
    pivotTimestamps: true,
  })
  declare comicGenres: ManyToMany<typeof Genre>

  @beforeCreate()
  @beforeUpdate()
  static async slugify(comic: Comic) {
    if (comic.slug) return
    const slug = string.slug(comic.title, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const rows = await Comic.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (!rows.length) {
      comic.slug = slug
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
    comic.slug = `${slug}-${increment}`
  }
}
