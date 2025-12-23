import type { HttpContext } from '@adonisjs/core/http'
import Purchase from '#models/purchase'
import Episode from '#models/episode'
import Creator from '#models/creator'
import UserWalet from '#models/user_walet'

export default class PurchasesController {
  async buyEpisode({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.redirect('/login')
      }

      const { id } = params

      const episode = await Episode.query()
        .where('id', id)
        .preload('comics', (q) => q.preload('creators'))
        .firstOrFail()

      const comicSlug = episode.comics.slug
      const episodeSlug = episode.slug

      const wallet = await UserWalet.query()
        .where('user_id', user.id)
        .first()

      if (!wallet) {
        return response.badRequest({
          message: 'Wallet tidak ditemukan. Silakan beli koin dulu.',
        })
      }

      const price = episode.coinPrice ?? 10

      const hasPurchased = await Purchase.query()
        .where('user_id', user.id)
        .where('episode_id', episode.id)
        .first()

      if (hasPurchased) {
        return response.redirect(`/episode/${comicSlug}/show/${episodeSlug}`)
      }

      if (wallet.coinBalance < price) {
        return response.badRequest({
          message: `Saldo tidak cukup. Harga: ${price} koin. Saldo kamu: ${wallet.coinBalance}`,
        })
      }

      const creatorShare = Math.floor(price * 0.7)
      const platformShare = price - creatorShare

      wallet.coinBalance -= price
      wallet.totalSpent = (wallet.totalSpent || 0) + price
      await wallet.save()

      await Purchase.create({
        userId: user.id,
        episodeId: episode.id,
        creatorId: episode.comics?.creatorId,
        coinSpent: price,
        platformShare,
        creatorShare,
      })

      if (episode.comics?.creatorId) {
        const creator = await Creator.query()
          .where('id', episode.comics.creatorId)
          .preload('users', (q) => q.preload('userWallet'))
          .first()

        if (creator?.users?.userWallet) {
          creator.users.userWallet.coinBalance += creatorShare
          creator.users.userWallet.totalPurchased =
            (creator.users.userWallet.totalPurchased || 0) + creatorShare

          await creator.users.userWallet.save()
        }
      }

      return response.redirect(`/episode/${comicSlug}/show/${episodeSlug}`)

    } catch (error) {
      console.error('❌ Error buying episode:', error)

      return response.internalServerError({
        message: error.message ?? 'Terjadi kesalahan saat membeli episode.',
      })
    }
  }
}
