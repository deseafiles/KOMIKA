import CoinPackage from '#models/coin_package'
import {createCoinPackageValidator} from '#validators/coin_package'
import type { HttpContext } from '@adonisjs/core/http'

//coin_package untuk admin bisa mendaftarkan koin untuk episode
//coin package index untuk nampilkan jumlah coin yang bisa dibeli paket paketnya gimana
//purchase index untuk

export default class CoinPackagesController {
  /**
   * Display a list of resource
   */
  async index({ inertia }: HttpContext) {
    const coin_package = await CoinPackage.all()

    return inertia.render('coin/index', {coin_package})
  }

  /**
   * Display form to create a new record
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('coin/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { name, coinAmount, price, bonusCoin } = await request.validateUsing(createCoinPackageValidator)

    const coin = await CoinPackage.firstOrCreate({
      name,
      coinAmount,
      price,
      bonusCoin
    })

    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Coin package created successfully',
        data: coin,
      })
    }

    return response.redirect().toRoute('/coin/index')
  }

  /**
   * Show individual record
   */
  async show({ params, inertia, request,response }: HttpContext) {
    const coin = await CoinPackage
                      .query()
                      .where('id', params.id)
                      .firstOrFail()
    if (request.accepts(['json'])) {
      return response.ok({
        message: 'Coin package created successfully',
        data: coin,
      })
    }

    return inertia.render('comic/show', { coin })
  }

  /**
   * Edit individual record
   */
  async edit({ params, inertia }: HttpContext) {
    const coin = await CoinPackage
                      .query()
                      .where('id', params.id)
                      .firstOrFail()

    return inertia.render('coin/edit', {coin})
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const coin = await CoinPackage.findOrFail(params.id)

    const payload = request.only(['name', 'coinAmount', 'price', 'bonusCoin'])

    await coin.merge(payload).save()
    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const coin = await CoinPackage.findOrFail(params.id)

    await coin.delete()

    return response.redirect().back()
  }
}
