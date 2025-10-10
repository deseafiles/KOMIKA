import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Creator from '#models/creator'
import Comic from '#models/comic'

test.group('Comic', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('can create a new comic', async ({ client }) => {
    const response = await client.post('/test/comic/create').json({
      title: 'test title',
      description: 'test description',
    })

    response.assertStatus(200)
  })
})

