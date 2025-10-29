import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username', 30).nullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.boolean('is_admin').defaultTo(false).notNullable()
      table.boolean('is_banned').defaultTo(false).nullable()
      table.boolean('is_deleted').defaultTo(false).nullable()
      table.timestamp('last_login_at').nullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_verified').defaultTo(false).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
