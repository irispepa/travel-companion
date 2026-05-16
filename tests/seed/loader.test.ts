import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../src/db/client'
import { loadSeedIfNeeded } from '../../src/seed/loader'
import { getSeedVersion } from '../../src/db/repositories/appMeta'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('loadSeedIfNeeded', () => {
  it('loads seed data on first call and sets seed version', async () => {
    const db = await openAppDB()
    await loadSeedIfNeeded(db)
    expect(await getSeedVersion(db)).toBe(1)
    const prague = await db.get('itinerary', 'prague')
    expect(prague).toBeDefined()
    db.close()
  })

  it('does not overwrite on second call', async () => {
    const db = await openAppDB()
    await loadSeedIfNeeded(db)
    const record = await db.get('itinerary', 'prague')
    record.days[0].items[0].name = 'EDITED'
    await db.put('itinerary', record)
    await loadSeedIfNeeded(db)
    const after = await db.get('itinerary', 'prague')
    expect(after.days[0].items[0].name).toBe('EDITED')
    db.close()
  })
})
