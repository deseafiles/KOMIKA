import CoinPackage from '#models/coin_package'
import Creator from '#models/creator'
import User from '#models/user'
import {profileValidator} from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display a list of resource
   * @admin
   */
  async index({ inertia, auth }: HttpContext) {
    //const admin = auth.user!

    const user = await User.query()
                           .where('isAdmin', false)
                           .where('is_banned', false)
                           .where('is_deleted', false)
                           .where('is_verified', false)

    return inertia.render('admin/users/index', { user })
  }

  /**
   * Show individual record
   * @user
   */
  async show({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const userData = await User
      .query()
      .where('id', user.id)
      .preload('userWallet')
      .preload('creator')
      .firstOrFail()

    const coinPackage = await CoinPackage.all()

    return inertia.render('profile/show', { userData, coinPackage })
  }

  /**
   * Edit individual record
   */
// Edit page
async edit({ params, inertia, auth }: HttpContext) {
  const user = await User.query()
                         .where('username', params.username)
                         .firstOrFail()
  return inertia.render('profile/edit', { creator: user })
}

async update({ params, request, response, auth }: HttpContext) {
  const user = auth.user!
  const creator = await Creator.query().where('userId', user.id).firstOrFail()

  const payload = await request.validateUsing(profileValidator)

  creator.bankName = payload.bankName
  creator.bankAccountName = payload.bankAccountName
  creator.bankAccountNumber = payload.bankAccountNumber

  await creator.save()

  if (request.accepts(['json'])) {
    return response.ok({ message: 'Data Creator berhasil diperbarui', data: creator })
  }

  return response.redirect().back()
}

/**
   * Ban user (admin only)
   */
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
}
