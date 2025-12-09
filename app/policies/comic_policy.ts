// app/policies/chapter_policy.ts
import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Episode from '#models/episode'

export default class ComicPolicy extends BasePolicy {
  /**
   * Cek apakah user bisa lihat episode ini
   * - Jika gratis (isPremium = false), semua bisa
   * - Jika berbayar dan user adalah pembuat komik, bisa
   * - Jika berbayar dan sudah membeli, bisa
   */
  async view(user: User | null, episode: Episode) {
    // Jika user null (tidak login)
    if (!user) {
      // Hanya bisa akses episode gratis
      return !episode.isPremium
    }

    // Episode gratis, semua bisa akses
    if (!episode.isPremium) {
      return true
    }

    // Load comic jika belum di-preload
    if (!episode.$preloaded.comics) {
      await episode.load('comics')
    }

    const comic = episode.comics

    // Load creators jika belum di-preload
    if (!comic.$preloaded.creators) {
      await comic.load('creators')
    }

    // User adalah pembuat komik, langsung bisa tanpa bayar
    if (comic.creators.userId === user.id) {
      return true
    }

    // Cek apakah user sudah membeli episode ini
    const purchase = await user
      .related('purchasedEpisodes')
      .query()
      .whereRaw('episode_id = ?', [episode.id])
      .first()

    return !!purchase
  }

  /**
   * Cek apakah user pembuat komik (bisa edit episode)
   */
  async edit(user: User, episode: Episode) {
    // Load comic jika belum di-preload
    if (!episode.$preloaded.comics) {
      await episode.load('comics')
    }

    const comic = episode.comics

    // Load creators jika belum di-preload
    if (!comic.$preloaded.creators) {
      await comic.load('creators')
    }

    return comic.creators.userId === user.id
  }

  /**
   * Cek apakah user pembuat komik (bisa delete episode)
   */
  async delete(user: User, episode: Episode) {
    // Load comic jika belum di-preload
    if (!episode.$preloaded.comics) {
      await episode.load('comics')
    }

    const comic = episode.comics

    // Load creators jika belum di-preload
    if (!comic.$preloaded.creators) {
      await comic.load('creators')
    }

    return comic.creators.userId === user.id
  }
}
