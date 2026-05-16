import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../../src/db/client'
import { getSeedVersion, setSeedVersion } from '../../../src/db/repositories/appMeta'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('appMeta repository', () => {
  it('returns 0 when seed version not set', async () => {
    const db = await openAppDB()
    expect(await getSeedVersion(db)).toBe(0)
    db.close()
  })

  it('returns the seed version after setSeedVersion', async () => {
    const db = await openAppDB()
    await setSeedVersion(db, 1)
    expect(await getSeedVersion(db)).toBe(1)
    db.close()
  })
})
