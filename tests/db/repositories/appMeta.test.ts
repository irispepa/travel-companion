import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../../src/db/client'
import { isInitialized, setInitialized } from '../../../src/db/repositories/appMeta'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('appMeta repository', () => {
  it('returns false when not initialized', async () => {
    const db = await openAppDB()
    expect(await isInitialized(db)).toBe(false)
    db.close()
  })

  it('returns true after setInitialized', async () => {
    const db = await openAppDB()
    await setInitialized(db)
    expect(await isInitialized(db)).toBe(true)
    db.close()
  })
})
