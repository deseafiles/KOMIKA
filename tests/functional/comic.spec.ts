import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

test.group('Model comic CRUD', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('guest user can access home page', async ({ client }) => {
    const response = await client.get('/')
    response.assertStatus(200)
  })
})

