import User from '#models/user'
import UserWalet from '#models/user_walet'
import Purchase from '#models/purchase'
import Episode from '#models/episode'
import Creator from '#models/creator'

export default class PurchaseService {
  static async buyEpisode(user: User, episode: Episode) {
    const wallet = await UserWalet.query().where('user_id', user.id).firstOrFail()
    if (!wallet) throw new Error('Wallet tidak ditemukan')

    const hasPurchased = await Purchase.query()
      .where('user_id', user.id)
      .where('episode_id', episode.id)
      .first()
    if (hasPurchased) throw new Error('Episode sudah dibeli')

    if (wallet.coinBalance < episode.coinPrice)
      throw new Error(`Saldo tidak cukup. Harga: ${episode.coinPrice}, saldo: ${wallet.coinBalance}`)

    const totalRevenue = episode.coinPrice * 2000
    const creatorShare = Math.floor(totalRevenue * 0.7)
    const platformShare = totalRevenue - creatorShare

    wallet.coinBalance -= episode.coinPrice
    wallet.totalSpent = (wallet.totalSpent || 0) + episode.coinPrice
    await wallet.save()

    await Purchase.create({
      userId: user.id,
      episodeId: episode.id,
      creatorId: episode.comics?.creatorId,
      coinSpent: episode.coinPrice,
      platformShare,
      creatorShare,
    })

    if (episode.comics?.creatorId) {
      const creator = await Creator.query()
        .where('id', episode.comics.creatorId)
        .first()
      if (creator) {
        creator.totalEarning = (parseFloat(creator.totalEarning) || 0) + creatorShare
        await creator.save()
      }
    }

    return {
      wallet,
      creatorShare,
      platformShare,
    }
  }
}
