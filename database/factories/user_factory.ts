import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { DateTime } from 'luxon'

export const AdminFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: 'admin@komika.com',
      username: 'Admin',
      password: 'Admin123',
      isAdmin: true,
      isBanned: false,
      isDeleted: false,
      lastLoginAt: DateTime.now().minus({ days: faker.number.int({ min: 1, max: 30 }) }),
    }
  })
  .build()

export const NormalUserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      username: faker.internet.username(),
      password: 'User123',
      isAdmin: false,
      isBanned: false,
      isDeleted: false,
      lastLoginAt: DateTime.now().minus({ days: faker.number.int({ min: 1, max: 30 }) }),
    }
  })
  .build()
