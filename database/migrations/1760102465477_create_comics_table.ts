import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('creator_id')
        .unsigned()
        .references('creators.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('title').notNullable()
      table.string('slug').unique()
      table.string('description').nullable()
      table.string('cover_url').nullable()
      table.enum('status', ['Ongoing', 'Hiatus', 'Completed']).defaultTo('Ongoing')
      table
        .enum('update_day', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'])
        .nullable()
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
