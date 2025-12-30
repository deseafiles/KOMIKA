import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

import Comic from '#models/comic'
import Creator from '#models/creator'
import User from '#models/user'

let creatorId: number

test.group('Comic.slugify', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    await Comic.query().delete()
    const user = await User.create({
      email: 'test@example.com',
      password: 'password',
    })

    const creator = await Creator.create({
      userId: user.id,
    })

    creatorId = creator.id
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('generate slug from title', async ({ assert }) => {
    const comic = await Comic.create({
      title: 'Hello World',
      description: 'test',
      creatorId,
    })

    assert.equal(comic.slug, 'hello-world')
  })

  test('normalize weird characters', async ({ assert }) => {
    const comic = await Comic.create({
      title: 'Hello @@@ World!!!',
      description: 'test',
      creatorId,
    })

    assert.equal(comic.slug, 'hello-world')
  })

  test('handle double spaces', async ({ assert }) => {
    const comic = await Comic.create({
      title: 'Hello   World',
      description: 'test',
      creatorId,
    })

    assert.equal(comic.slug, 'hello-world')
  })

  test('add suffix when slug already exists', async ({ assert }) => {
    await Comic.create({
      title: 'Hello World',
      description: 'first',
      creatorId,
    })

    const comic2 = await Comic.create({
      title: 'Hello World',
      description: 'second',
      creatorId,
    })

    assert.equal(comic2.slug, 'hello-world-1')
  })

  test('increment suffix correctly', async ({ assert }) => {
    await Comic.create({ title: 'Hello World', description: '1', creatorId })
    await Comic.create({ title: 'Hello World', description: '2', creatorId })
    await Comic.create({ title: 'Hello World', description: '3', creatorId })

    const comic = await Comic.create({
      title: 'Hello World',
      description: '4',
      creatorId,
    })

    assert.equal(comic.slug, 'hello-world-3')
  })
})
