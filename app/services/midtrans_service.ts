import Midtrans from 'midtrans-client'

interface TransactionData {
  id: string
  name: string
  price: number
}

export class MidtransService {
  private snap: Midtrans.Snap

  constructor() {
    this.snap = new Midtrans.Snap({
      isProduction : String(process.env.MIDTRANS_PRODUCTION).toLowerCase() === 'true' || false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    })
  }

  async createTransaction({ id, name, price }: TransactionData) {
    try {
      console.log('🔄 Creating Midtrans transaction with params:', {
        order_id: id,
        name,
        price,
        price_type: typeof price,
      })

      const numPrice = Number(price)
      if (isNaN(numPrice) || numPrice <= 0) {
        throw new Error(`Invalid price: ${price}`)
      }

      const parameter = {
        transaction_details: {
          order_id: String(id),
          gross_amount: numPrice,
        },
        item_details: [
          {
            id: String(id),
            price: numPrice,
            quantity: 1,
            name: String(name),
          },
        ],
        custom_field1: `Pembelian ${name}`,
      }

      console.log('📝 Midtrans parameter:', JSON.stringify(parameter, null, 2))

      const token = await this.snap.createTransactionToken(parameter)

      console.log('✅ Midtrans token generated:', token)

      return token
    } catch (error) {
      console.error('❌ Error creating Midtrans transaction:', error)
      throw error
    }
  }

  /**
   * Cek status transaksi ke Midtrans
   */
  async checkTransactionStatus(orderId: string) {
    try {
      console.log('🔍 Checking Midtrans transaction status:', orderId)
      const status = await this.snap.transaction.status(orderId)
      console.log('📊 Transaction status:', status)
      return status
    } catch (error) {
      console.error('❌ Error checking transaction status:', error)
      throw error
    }
  }
}
