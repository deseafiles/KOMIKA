import type { HttpContext } from '@adonisjs/core/http'
import Purchase from '#models/purchase'
import Episode from '#models/episode'
import Creator from '#models/creator'

export default class PurchasesController {
  /**
   * User membeli episode menggunakan coin
   */
  async buyEpisode({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const episode = await Episode.query()
      .where('id', params.id)
      .preload('comics', (comicQuery) => comicQuery.preload('creators'))
      .firstOrFail()

    const wallet = await UserWallet.query()
      .where('user_id', user.id)
      .firstOrFail()

    // misalnya harga episode kamu punya kolom "price" di tabel episode
    const price = episode.coinPrice ?? 10 // default harga 10 coin

    // cek sudah pernah beli
    const existingPurchase = await Purchase.query()
      .where('user_id', user.id)
      .where('episode_id', episode.id)
      .first()

    if (existingPurchase) {
      return response.badRequest({ message: 'Episode ini sudah kamu beli.' })
    }

    // cek saldo cukup
    if (wallet.coin_balance < price) {
      return response.badRequest({ message: 'Saldo kamu tidak cukup untuk membeli episode ini.' })
    }

    // pembagian hasil (misalnya: 70% ke creator, 30% ke platform)
    const creatorShare = Math.floor(price * 0.7)
    const platformShare = price - creatorShare

    try {
      // kurangi saldo user
      wallet.coin_balance -= price
      wallet.totalSpent += price
      await wallet.save()

      // catat purchase
      const purchase = await Purchase.create({
        userId: user.id,
        episodeId: episode.id,
        creatorId: episode.comics.creatorId,
        coinSpent: price,
        platformShare,
        creatorShare,
      })

      // (Opsional) tambahkan coin ke wallet creator
      const creator = await Creator.query()
        .where('id', episode.comics.creatorId)
        .preload('users', (userQuery) => userQuery.preload('userWallet'))
        .first()

      if (creator?.users.userWallet) {
        creator.users.userWallet.coin_balance += creatorShare
        creator.users.userWallet.totalPurchased += creatorShare
        await creator.users.userWallet.save()
      }

      return response.ok({
        message: 'Episode berhasil dibeli!',
        new_balance: wallet.coin_balance,
        purchase,
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Terjadi kesalahan saat membeli episode.' })
    }
  }

  /**
   * Daftar episode yang pernah dibeli user
   */
  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!

    const purchases = await Purchase.query()
      .where('user_id', user.id)
      .preload('episodes', (episodeQuery) => episodeQuery.preload('comics'))

    return inertia.render('user/purchases/index', { purchases })
  }
}
