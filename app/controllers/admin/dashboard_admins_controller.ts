import type { HttpContext } from '@adonisjs/core/http'

import Comic from '#models/comic'
import User from '#models/user'
import Purchase from '#models/purchase'

export default class DashboardAdminsController {
  async index({ inertia }: HttpContext) {
    // Hitung jumlah comic (yang tidak dihapus)
    const comicCountRow = await Comic.query()
      .where('isDeleted', false)
      .count('id', 'count')
      .first()

    // Hitung jumlah user aktif (bukan admin, tidak dibanned)
    const userCountRow = await User.query()
      .where('isAdmin', false)
      .where('isBanned', false)
      .count('id', 'count')
      .first()

    // Hitung total pendapatan platform
    const totalRevenueRow = await Purchase.query()
      .sum('platformShare', 'total')
      .first()

    const comicCount = Number(comicCountRow?.$extras?.count || 0)
    const userCount = Number(userCountRow?.$extras?.count || 0)
    const totalRevenue = Number(totalRevenueRow?.$extras?.total || 0)

    return inertia.render('admin/Dashboard/index', {
      comicCount,
      userCount,
      totalRevenue,
    })
  }

  async getAllUsers({ inertia }: HttpContext) {
    const users = await User.query().where('isVerified', true)

    return inertia.render('admin/UserManagement/users', {users})
  }

  async banUser({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    user.isBanned = true
    await user.save()

    return response.ok({ message: 'User has been banned' })
  }

  /**
   * Unban user (admin only)
   */
  async unbanUser({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    user.isBanned = false
    await user.save()

    return response.ok({ message: 'User has been unbanned' })
  }

  async getAllComic({ inertia }: HttpContext) {
    const comics = await Comic.all()

    return inertia.render('admin/UserManagement/comics', {comics})
  }

  async banComic({ params, response }: HttpContext) {
    const comic = await Comic.query()
                             .where('slug', params.slug)
                             .firstOrFail()
    comic.isDeleted = true
    await comic.save()

    return response.redirect().toRoute('/admin/comics')

  }

  async unBanComic({params, response}: HttpContext) {
    const comic = await Comic.query()
                             .where('slug', params.slug)
                             .firstOrFail()
    comic.isDeleted = false
    await comic.save()

    return response.redirect().toRoute('/admin/comics')
  }
}
