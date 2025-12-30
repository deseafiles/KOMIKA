import db from '@adonisjs/lucid/services/db'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

export async function createVerificationToken(userId: number) {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex')

  await db.table('email_verifications').insert({
    user_id: userId,
    token_text: hashedToken,
    expired_at: DateTime.now().plus({ hours: 24 }).toSQL(),
    created_at: DateTime.now().toSQL(),
  })

  return rawToken
}

