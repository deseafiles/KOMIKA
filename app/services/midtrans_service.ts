import Midtrans from 'midtrans-client'

interface TransactionData {
  id: number
  name: string
  price: number
}

export class MidtransService {
  private snap: Midtrans.Snap

  constructor() {
    this.snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    })
  }

  async createTransaction({ id, name, price }: TransactionData) {
    const parameter = {
      item_details: {
        name: name,
        price: price,
        quantity: 1
      },
      transaction_details: {
        order_id: id,
        gross_amount: price
      }
    }

    const token = await this.snap.createTransactionToken(parameter)

    return token.toJSON()
  }
}
