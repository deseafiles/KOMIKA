import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()
      table
        .integer('episode_id')
        .unsigned()
        .references('episodes.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('creator_id')
        .unsigned()
        .references('creators.id')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('coin_spent')
      table.decimal('platform_share', 15)
      table.decimal('creator_share', 15)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

