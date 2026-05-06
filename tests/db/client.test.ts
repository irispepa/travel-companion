import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { openAppDB } from '../../src/db/client'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))
afterEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('openAppDB', () => {
  it('opens the database with all required stores', async () => {
    const db = await openAppDB()
    expect(db.objectStoreNames.contains('appMeta')).toBe(true)
    expect(db.objectStoreNames.contains('userPreferences')).toBe(true)
    expect(db.objectStoreNames.contains('itinerary')).toBe(true)
    expect(db.objectStoreNames.contains('activities')).toBe(true)
    expect(db.objectStoreNames.contains('phrases')).toBe(true)
    expect(db.objectStoreNames.contains('memories')).toBe(true)
    expect(db.objectStoreNames.contains('exchangeRates')).toBe(true)
    db.close()
  })
})
