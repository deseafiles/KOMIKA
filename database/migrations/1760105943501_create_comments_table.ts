import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('episode_id').unsigned().references('episodes.id').onDelete('CASCADE')
      table.integer('parent_comment_id').unsigned().references('comments.id').onDelete('CASCADE').nullable()
      table.string('content', 255).notNullable()
      table.boolean('is_delete').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

