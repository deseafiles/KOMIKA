import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import CoinPackage from '#models/coin_package'
import UserWalet from '#models/user_walet'
import { MidtransService } from '#services/midtrans_service'
import { DateTime } from 'luxon'
import crypto from 'crypto'

export default class TransactionsController {
  async createTransaction({ request, response, auth }: HttpContext) {
    try {
      if (!auth.user) {
        return response.unauthorized({ message: 'User not authenticated' })
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
      console.error('❌ Create transaction error:', error)
      return response.internalServerError({
        message: error instanceof Error ? error.message : 'Failed to create transaction',
      })
    }
  }

  async handleWebhook({ request, response }: HttpContext) {
    try {
      const payload = request.all()
      console.log('📨 Webhook received at:', new Date().toISOString())
      console.log('📨 Full payload:', JSON.stringify(payload, null, 2))

      const signature = request.header('X-Midtrans-Signature')
      if (signature && !this.verifySignature(payload, signature)) {
        console.warn('⚠️ Invalid signature')
        return response.forbidden({ message: 'Invalid signature' })
      }

      const { order_id, transaction_status, settlement_time } = payload

      if (!order_id) {
        return response.ok({ message: 'Missing order_id' })
      }

      const transaction = await Transaction.query()
        .where('order_id', order_id)
        .first()

      if (!transaction) {
        console.warn(`⚠️ Transaction not found: ${order_id}`)
        return response.ok({ message: 'Transaction not found' })
      }

      console.log(`📊 Processing webhook for ${order_id}: ${transaction_status}`)

      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        transaction.status = 'settlement'
        transaction.isPaid = true

        if (settlement_time) {
          transaction.paidAt = DateTime.fromISO(settlement_time.replace(' ', 'T'))
        } else {
          transaction.paidAt = DateTime.now()
        }

        await transaction.save()

        const pkg = await CoinPackage.find(transaction.coinPackageId)
        if (!pkg) {
          console.error(`❌ Package not found: ${transaction.coinPackageId}`)
          return response.ok({ message: 'Coin package not found' })
        }

        let wallet = await UserWalet.query()
          .where('user_id', transaction.userId)
          .first()

        if (!wallet) {
          wallet = await UserWalet.create({
            userId: transaction.userId,
            coinBalance: 0,
            totalPurchased: 0,
          })
        }

        const totalCoin = pkg.coinAmount + (pkg.bonusCoin || 0)

        wallet.coinBalance += totalCoin
        wallet.totalPurchased += totalCoin
        await wallet.save()

        console.log(`✅ User ${transaction.userId} received ${totalCoin} coins`)
      }

      if (transaction_status === 'pending') {
        transaction.status = 'pending'
        await transaction.save()
        console.log(`⏳ Transaction ${order_id} still pending`)
      }

      if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
        transaction.status = 'failed'
        await transaction.save()
        console.log(`❌ Transaction ${order_id} failed: ${transaction_status}`)
      }

      return response.ok({ message: 'Webhook processed successfully' })
    } catch (error) {
      console.error('❌ Webhook error:', error)
      return response.ok({ message: 'Webhook error handled' })
    }
  }

  async checkStatus({ params, response }: HttpContext) {
    try {
      const { orderId } = params

      if (!orderId) {
        return response.badRequest({
          message: 'orderId is required',
        })
      }

      const transaction = await Transaction.query()
        .where('order_id', orderId)
        .first()

      if (!transaction) {
        console.warn(`⚠️ Transaction not found: ${orderId}`)
        return response.ok({
          message: 'Transaction not found',
          data: {
            status: 'not_found',
            isPaid: false,
          },
        })
      }

      if (!transaction.isPaid && transaction.status === 'pending') {
        console.log(`🔍 Checking Midtrans status for ${orderId}...`)
        try {
          const midtransService = new MidtransService()
          const midtransStatus = await midtransService.checkTransactionStatus(orderId)

          console.log(`📊 Midtrans status: ${midtransStatus.transaction_status}`)

          if (midtransStatus.transaction_status === 'settlement' || midtransStatus.transaction_status === 'capture') {
            transaction.status = 'settlement'
            transaction.isPaid = true
            transaction.paidAt = DateTime.now()
            await transaction.save()

            const pkg = await CoinPackage.find(transaction.coinPackageId)
            if (pkg) {
              let wallet = await UserWalet.query()
                .where('user_id', transaction.userId)
                .first()

              if (!wallet) {
                wallet = await UserWalet.create({
                  userId: transaction.userId,
                  coinBalance: 0,
                  totalPurchased: 0,
                })
              }

              const totalCoin = pkg.coinAmount + (pkg.bonusCoin || 0)
              wallet.coinBalance += totalCoin
              wallet.totalPurchased += totalCoin
              await wallet.save()

              console.log(`✅ User ${transaction.userId} received ${totalCoin} coins (via polling)`)
            }
          }
        } catch (midtransError) {
          console.warn('⚠️ Could not check Midtrans status:', midtransError)
        }
      }

      console.log(`📊 Status check for ${orderId}: ${transaction.status}`)

      return response.ok({
        message: 'Transaction status retrieved',
        data: {
          id: transaction.id,
          orderId: transaction.orderId,
          status: transaction.status,
          isPaid: transaction.isPaid,
          coinReceived: transaction.coinReceived,
          createdAt: transaction.createdAt,
          paidAt: transaction.paidAt,
        },
      })
    } catch (error) {
      console.error('❌ Check status error:', error)
      return response.ok({
        message: 'Check status error',
        data: {
          status: 'error',
          isPaid: false,
        },
      })
    }
  }

  async getHistory({ auth, response }: HttpContext) {
    try {
      if (!auth.user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const transactions = await Transaction.query()
        .where('user_id', auth.user.id)
        .preload('coinPackage')
        .orderBy('created_at', 'desc')

      return response.ok({
        message: 'Transaction history retrieved',
        data: transactions,
      })
    } catch (error) {
      console.error('❌ Get history error:', error)
      return response.internalServerError({
        message: error instanceof Error ? error.message : 'Failed to fetch history',
      })
    }
  }

  async markSettlement({ params, response }: HttpContext) {
    try {
      const { orderId } = params

      if (!orderId) {
        return response.badRequest({
          message: 'orderId is required',
        })
      }

      const transaction = await Transaction.query()
        .where('order_id', orderId)
        .first()

      if (!transaction) {
        return response.notFound({
          message: 'Transaction not found',
        })
      }

      // Update transaction
      transaction.status = 'settlement'
      transaction.isPaid = true
      transaction.paidAt = DateTime.now()
      await transaction.save()

      console.log(`✅ Marked transaction ${orderId} as settlement`)

      // Update wallet
      const pkg = await CoinPackage.find(transaction.coinPackageId)
      if (!pkg) {
        console.error(`❌ Package not found: ${transaction.coinPackageId}`)
        return response.ok({ message: 'Transaction marked but package not found' })
      }

      let wallet = await UserWalet.query()
        .where('user_id', transaction.userId)
        .first()

      if (!wallet) {
        wallet = await UserWalet.create({
          userId: transaction.userId,
          coinBalance: 0,
          totalPurchased: 0,
        })
      }

      const totalCoin = pkg.coinAmount + (pkg.bonusCoin || 0)

      wallet.coinBalance += totalCoin
      wallet.totalPurchased += totalCoin
      await wallet.save()

      console.log(`✅ User ${transaction.userId} received ${totalCoin} coins`)

      return response.ok({
        message: 'Transaction marked as settlement',
        data: {
          id: transaction.id,
          orderId: transaction.orderId,
          status: transaction.status,
          isPaid: transaction.isPaid,
        },
      })
    } catch (error) {
      console.error('❌ Mark settlement error:', error)
      return response.internalServerError({
        message: error instanceof Error ? error.message : 'Failed to mark settlement',
      })
    }
  }

  /**
   * Verify Midtrans webhook signature
   */
  private verifySignature(payload: any, signature: string): boolean {
    try {
      const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
      const orderId = payload.order_id
      const statusCode = payload.status_code
      const grossAmount = payload.gross_amount

      const data = `${orderId}${statusCode}${grossAmount}${serverKey}`
      const hash = crypto.createHash('sha512').update(data).digest('hex')

      return hash === signature
    } catch (error) {
      console.error('❌ Signature verification error:', error)
      return false
    }
  }
}
