import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('episode_id')
        .unsigned()
        .references('episodes.id')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('page_number').notNullable()
      table.string('image_url').notNullable()
      table.integer('image_width').unsigned()
      table.integer('image_height').unsigned()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

