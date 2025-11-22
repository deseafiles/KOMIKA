// app/controllers/transactions_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import CoinPackage from '#models/coin_package'
import UserWalet from '#models/user_walet'
import { MidtransService } from '#services/midtrans_service'
import { DateTime } from 'luxon'

export default class TransactionsController {
  /**
   * POST /transaction/create
   */
  async createTransaction({ request, response, auth }: HttpContext) {
    try {
      if (!auth.user) {
        return response.unauthorized({ message: 'Anda harus login terlebih dahulu' })
      }

      const user = auth.user
      const { coinPackageId } = request.only(['coinPackageId'])

      const packageId = Number(coinPackageId)
      if (!packageId) {
        return response.badRequest({ message: 'coinPackageId harus berupa number' })
      }

      const coinPackage = await CoinPackage.find(packageId)
      if (!coinPackage) {
        return response.notFound({ message: 'Paket koin tidak ditemukan' })
      }

      const orderId = `ORDER-${user.id}-${Date.now()}`

      const transaction = await Transaction.create({
        userId: user.id,
        coinPackageId: coinPackage.id,
        orderId,
        coinReceived: coinPackage.coinAmount,
        status: 'pending',
        isPaid: false,
      })

      const midtransService = new MidtransService()

      const snapToken = await midtransService.createTransaction({
        id: orderId,
        name: coinPackage.name,
        price: Number(coinPackage.price),
      })

      return response.ok({
        message: 'Transaction token created successfully',
        data: {
          transactionId: transaction.id,
          orderId,
          snapToken,
          coinPackage: {
            id: coinPackage.id,
            name: coinPackage.name,
            coinAmount: coinPackage.coinAmount,
            bonusCoin: coinPackage.bonusCoin || 0,
            price: coinPackage.price,
          },
        },
      })
    } catch (error) {
      console.error('❌ Error creating transaction:', error)
      return response.internalServerError({
        message: error.message || 'Failed to create transaction',
      })
    }
  }

  /**
   * POST /transaction/webhook
   */
  async handleWebhook({ request, response }: HttpContext) {
    try {
      const payload = request.all()
      const { order_id, transaction_status, settlement_time } = payload

      if (!order_id) return response.ok({ message: 'Missing order_id' })

      const transaction = await Transaction.query()
        .where('order_id', order_id)
        .first()

      if (!transaction) return response.ok({ message: 'Transaction not found' })

      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        transaction.status = 'settlement'
        transaction.isPaid = true

        // FIX: gunakan DateTime
        if (settlement_time) {
          transaction.paidAt = DateTime.fromISO(settlement_time.replace(' ', 'T'))
        } else {
          transaction.paidAt = DateTime.now()
        }

        await transaction.save()

        const pkg = await CoinPackage.find(transaction.coinPackageId)
        if (!pkg) return response.ok({ message: 'Coin package not found' })

        const wallet = await UserWalet.query()
          .where('user_id', transaction.userId)
          .first()

        if (!wallet) return response.ok({ message: 'User wallet not found' })

        const totalCoin = pkg.coinAmount + (pkg.bonusCoin || 0)

        wallet.coinBalance += totalCoin
        wallet.totalPurchased += totalCoin
        await wallet.save()

        console.log(`💰 User ${transaction.userId} received ${totalCoin} coins`)
      }

      if (transaction_status === 'pending') {
        transaction.status = 'pending'
        await transaction.save()
      }

      if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
        transaction.status = 'failed'
        await transaction.save()
      }

      return response.ok({ message: 'Webhook processed' })
    } catch (error) {
      console.error('❌ Webhook error:', error)
      return response.ok({ message: 'Webhook error handled' })
    }
  }

  /**
   * GET /transaction/status/:orderId
   */
  async checkStatus({ params, response }: HttpContext) {
    try {
      const transaction = await Transaction.query()
        .where('order_id', params.orderId)
        .first()

      if (!transaction) {
        return response.notFound({ message: 'Transaction not found' })
      }

      return response.ok({
        message: 'Transaction status retrieved',
        data: transaction,
      })
    } catch (error) {
      return response.internalServerError({
        message: error.message || 'Failed to check status',
      })
    }
  }

  /**
   * GET /transaction/history
   */
  async getHistory({ auth, response }: HttpContext) {
    try {
      const transactions = await Transaction.query()
        .where('user_id', auth.user!.id)
        .preload('coinPackages')
        .orderBy('created_at', 'desc')

      return response.ok({
        message: 'Transaction history retrieved',
        data: transactions,
      })
    } catch (error) {
      return response.internalServerError({
        message: error.message || 'Failed to fetch history',
      })
    }
  }
}
