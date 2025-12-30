import type { HttpContext } from '@adonisjs/core/http'
import Episode from '#models/episode'
import PurchaseService from '#services/purchase_service'

export default class PurchasesController {
  async buyEpisode({ params, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.redirect('/login')

    const episode = await Episode.query()
      .where('id', params.id)
      .preload('comics', (q) => q.preload('creators'))
      .firstOrFail()

    try {
      await PurchaseService.buyEpisode(user, episode)
      return response.redirect(`/episode/${episode.comics.slug}/show/${episode.slug}`)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
