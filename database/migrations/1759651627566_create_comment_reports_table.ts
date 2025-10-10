import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comment_reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()
      table
        .integer('target_user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('comment_id')
        .unsigned()
        .references('comments.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('episode_id')
        .unsigned()
        .references('episodes.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('reason').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
