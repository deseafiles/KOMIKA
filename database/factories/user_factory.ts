import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { DateTime } from 'luxon'

export const AdminFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: 'webkomik@gmail.com',
      username: 'Admin',
      password: 'Admin webcomic',
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
      email: 'aly123@gmail.com',
      username: 'aly123',
      password: '12345678',
      isAdmin: false,
      isBanned: false,
      isDeleted: false,
      lastLoginAt: DateTime.now().minus({ days: faker.number.int({ min: 1, max: 30 }) }),
    }
  })
  .build()
