import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { openAppDB } from '../../src/db/client'
import { getLineOfDay, upsertLineOfDay } from '../../src/db/repositories/linesOfDay'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))
afterEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('linesOfDay repository', () => {
  it('returns undefined when no line exists', async () => {
    const db = await openAppDB()
    const result = await getLineOfDay(db, 'prague', '2026-06-14')
    db.close()
    expect(result).toBeUndefined()
  })

  it('upserts and retrieves a line', async () => {
    const db = await openAppDB()
    const line = { id: 'l1', cityId: 'prague' as const, date: '2026-06-14', text: 'We got lost.', updatedAt: '2026-06-14T20:00:00Z' }
    await upsertLineOfDay(db, line)
    const result = await getLineOfDay(db, 'prague', '2026-06-14')
    db.close()
    expect(result?.text).toBe('We got lost.')
  })

  it('overwrites on second upsert', async () => {
    const db = await openAppDB()
    const line = { id: 'l1', cityId: 'prague' as const, date: '2026-06-14', text: 'First.', updatedAt: '2026-06-14T10:00:00Z' }
    await upsertLineOfDay(db, line)
    await upsertLineOfDay(db, { ...line, text: 'Second.', updatedAt: '2026-06-14T20:00:00Z' })
    const result = await getLineOfDay(db, 'prague', '2026-06-14')
    db.close()
    expect(result?.text).toBe('Second.')
  })
})
