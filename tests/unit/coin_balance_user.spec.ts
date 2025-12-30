import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import User from '#models/user'
import UserWalet from '#models/user_walet'
import Purchase from '#models/purchase'
import Episode from '#models/episode'
import Creator from '#models/creator'
import Comic from '#models/comic'
import PurchaseService from '#services/purchase_service'

test.group('PurchaseService.buyEpisode', (group) => {
  let user: User
  let wallet: UserWalet
  let creatorUser: User
  let creator: Creator
  let comic: Comic
  let episode: Episode

  group.each.setup(async () => {
    await db.beginGlobalTransaction()

    const timestamp = Date.now()

    user = await User.create({
      username: `buyer_${timestamp}`,
      email: `buyer${timestamp}@test.com`,
      password: 'secret123',
      isAdmin: false,
    })

    wallet = await UserWalet.create({
      userId: user.id,
      coinBalance: 100,
      totalSpent: 0,
      totalPurchased:0,
      totalMoneySpent: 0,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    })

    creatorUser = await User.create({
      username: `creator_${timestamp}`,
      email: `creator${timestamp}@test.com`,
      password: 'secret123',
    })

    creator = await Creator.create({
      userId: creatorUser.id,
      totalEarning: 0,
      withdrawnBalance: 0,
    })

    comic = await Comic.create({
      creatorId: creator.id,
      title: `Comic Test ${timestamp}`,
      slug: `comic-test-${timestamp}`,
      description: 'Ini adalah comic test',
      status: 'Ongoing',
    })

    episode = await Episode.create({
      title: 'Episode 1',
      coinPrice: 10,
      comicId: comic.id,
      slug: `episode-1-${timestamp}`,
      episodeNumber: 1,
      thumbnailUrl: 'url-episode-test',
      publishedAt: DateTime.now(),
    })

    if (!user.id || !creator.id || !comic.id || !episode.id) {
      throw new Error('Setup gagal: data tidak dibuat dengan benar')
    }
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('throws error if episode already purchased', async ({ assert }) => {
    await Purchase.create({
      userId: user.id,
      episodeId: episode.id,
      creatorId: creator.id,
      coinSpent: 10,
      platformShare: 6,
      creatorShare: 14,
    })

    await assert.rejects(async () => {
      await PurchaseService.buyEpisode(user, episode)
    }, 'Episode sudah dibeli')
  })

  test('throws error if coin balance is insufficient', async ({ assert }) => {
    wallet.coinBalance = 5
    await wallet.save()

    await assert.rejects(async () => {
      await PurchaseService.buyEpisode(user, episode)
    }, /Saldo tidak cukup/)
  })

})
