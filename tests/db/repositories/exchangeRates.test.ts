import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../../src/db/client'
import { getCachedRate, setCachedRate } from '../../../src/db/repositories/exchangeRates'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('exchangeRates repository', () => {
  it('returns undefined for missing pair', async () => {
    const db = await openAppDB()
    expect(await getCachedRate(db, 'CZK-USD')).toBeUndefined()
    db.close()
  })

  it('stores and retrieves a rate', async () => {
    const db = await openAppDB()
    await setCachedRate(db, { pair: 'CZK-USD', rate: 0.045, fetchedAt: '2026-06-14' })
    const result = await getCachedRate(db, 'CZK-USD')
    expect(result?.rate).toBe(0.045)
    db.close()
  })
})
