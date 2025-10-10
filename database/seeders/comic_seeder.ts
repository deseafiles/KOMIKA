import { ComicFactory } from '#database/factories/comic_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await ComicFactory.createMany(5)
  }
}

