import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'creators'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()
      table.decimal('total_earning', 12).unsigned().defaultTo(0)
      table.decimal('withdrawn_balance', 12).unsigned().defaultTo(0)
      table.string('bank_name')
      table.string('bank_account_name')
      table.string('bank_account_number')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
