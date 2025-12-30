import { test } from '@japa/runner'
import Hash from '@adonisjs/core/services/hash'

test.group('Password Hashing', () => {
  test('hashes password', async ({ assert }) => {
    const password = 'secret123'
    const hashed = await Hash.make(password)

    assert.isString(hashed)
    assert.notEqual(hashed, password)
  })

  test('same password generates different hash', async ({ assert }) => {
    const password = 'secret123'

    const hash1 = await Hash.make(password)
    const hash2 = await Hash.make(password)

    assert.notEqual(hash1, hash2)
  })

  test('can verify hashed password', async ({ assert }) => {
    const password = 'secret123'
    const hashed = await Hash.make(password)

    const isValid = await Hash.verify(hashed, password)
    assert.isTrue(isValid)
  })
})
