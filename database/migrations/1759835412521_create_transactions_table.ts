import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()
      table
        .integer('coin_package_id')
        .unsigned()
        .references('coin_packages.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('order_id')
      table.integer('coin_received').unsigned().defaultTo(0)
      table.enum('status', ['pending', 'settlement', 'expired', 'cancelled']).defaultTo('pending')
      table.boolean('is_paid').defaultTo(false)
      table.timestamp('paid_at')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

