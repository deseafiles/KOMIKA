import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comic_ratings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').references('users.id').onDelete('CASCADE')
      table.integer('comic_id').references('comics.id').onDelete('CASCADE')
      table.enum('rating_value', [0, 1, 2, 3, 4, 5]).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['user_id', 'comic_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

