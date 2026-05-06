import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../../src/db/client'
import { getCurrencyPref, setCurrencyPref } from '../../../src/db/repositories/userPreferences'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('userPreferences repository', () => {
  it('returns undefined when no pref set', async () => {
    const db = await openAppDB()
    expect(await getCurrencyPref(db, 'prague')).toBeUndefined()
    db.close()
  })

  it('stores and retrieves currency pref', async () => {
    const db = await openAppDB()
    await setCurrencyPref(db, 'prague', { from: 'CZK', to: 'USD' })
    const result = await getCurrencyPref(db, 'prague')
    expect(result).toEqual({ from: 'CZK', to: 'USD' })
    db.close()
  })
})
