import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'episodes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('comic_id').unsigned().references('comics.id').onDelete('CASCADE').notNullable()
      table.string('title').nullable()
      table.string('slug').nullable()
      table.integer('episode_number').notNullable()
      table.string('thumbnail_url').notNullable()
      table.integer('coin_price').defaultTo(0)
      table.boolean('is_premium').defaultTo(false)
      table.boolean('is_published').defaultTo(false)
      table.timestamp('published_at')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

