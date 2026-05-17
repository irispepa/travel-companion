import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../../src/db/client'
import { getCurrencyPref, setCurrencyPref, getFavoritePhrases, toggleFavoritePhrase } from '../../../src/db/repositories/userPreferences'

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

describe('favoritePhrases repository', () => {
  it('returns empty array when no favorites exist', async () => {
    const db = await openAppDB()
    expect(await getFavoritePhrases(db, 'prague')).toEqual([])
    db.close()
  })

  it('adds a favorite phrase', async () => {
    const db = await openAppDB()
    await toggleFavoritePhrase(db, 'prague', 'Thank you')
    expect(await getFavoritePhrases(db, 'prague')).toEqual(['Thank you'])
    db.close()
  })

  it('removes an already-favorited phrase on second toggle', async () => {
    const db = await openAppDB()
    await toggleFavoritePhrase(db, 'prague', 'Thank you')
    await toggleFavoritePhrase(db, 'prague', 'Thank you')
    expect(await getFavoritePhrases(db, 'prague')).toEqual([])
    db.close()
  })

  it('scopes favorites per city', async () => {
    const db = await openAppDB()
    await toggleFavoritePhrase(db, 'prague', 'Thank you')
    expect(await getFavoritePhrases(db, 'vienna')).toEqual([])
    db.close()
  })
})
