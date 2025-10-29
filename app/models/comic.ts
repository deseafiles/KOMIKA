import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
  manyToMany,
  beforeSave,
} from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Episode from './episode.js'
import Creator from './creator.js'
import Genre from './genre.js'
import User from './user.js'

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

  @manyToMany(() => User, {
    pivotTable: 'comic_ratings',
  })
  declare comicRatings: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'comic_favorites'
  })
  declare comicFavorites: ManyToMany<typeof User>

  @beforeSave()
  static async slugify(comic: Comic) {
    // Jalankan kalau slug belum ada atau title berubah
    if (!comic.slug || comic.$dirty.title) {
      const slug = string.slug(comic.title, {
        replacement: '-',
        lower: true,
        strict: true,
      })

      const rows = await Comic.query()
        .select('slug')
        .whereRaw('lower(??) = ?', ['slug', slug])
        .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

      // Kalau belum ada slug yang sama, pakai langsung
      if (!rows.length) {
        comic.slug = slug
        return
      }

      // Kalau sudah ada slug serupa, tambahkan increment di belakang
      const incrementors = rows.reduce<number[]>((result, row) => {
        const tokens = row.slug.toLowerCase().split(`${slug}-`)
        if (tokens.length < 2) return result
        const increment = Number(tokens.at(1))
        if (!Number.isNaN(increment)) result.push(increment)
        return result
      }, [])

      const increment = incrementors.length
        ? Math.max(...incrementors) + 1
        : 1

      comic.slug = `${slug}-${increment}`
    }
  }
}
