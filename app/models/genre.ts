import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Comic from './comic.js'
import type {ManyToMany} from '@adonisjs/lucid/types/relations'

export default class Genre extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Comic, {
    pivotTable: 'comic_genres',
    pivotTimestamps: true,
  })
  declare genreComics: ManyToMany<typeof Comic>
}
