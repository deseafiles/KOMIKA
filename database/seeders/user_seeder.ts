import { AdminFactory, NormalUserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await AdminFactory.create()

    await NormalUserFactory.createMany(5)
  }
}

