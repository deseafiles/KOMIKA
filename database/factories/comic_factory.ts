import Factory from '@adonisjs/lucid/factories'
import Comic from '#models/comic'
import { faker } from '@faker-js/faker'

export const ComicFactory = Factory.define(Comic, ({ faker }) => {
  const title = faker.commerce.productName()

  return {
    userId: 1,
    title,
    description: faker.lorem.paragraph(),
    coverUrl: faker.image.urlLoremFlickr({ category: 'comic' }),
    updateDay: faker.helpers.arrayElement([
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
      'Minggu',
    ]),
    isDeleted: false,
  }
}).build()

