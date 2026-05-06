import { describe, it, expect, beforeEach } from 'vitest'
import { openAppDB } from '../../../src/db/client'
import { getMemories, addMemory, deleteMemory } from '../../../src/db/repositories/memories'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('memories repository', () => {
  it('adds and retrieves a memory', async () => {
    const db = await openAppDB()
    await addMemory(db, { id: '1', cityId: 'prague', author: 'Iris', timestamp: '2026-06-14T10:00:00Z', location: 'Prague Castle', photos: [], note: 'Amazing' })
    const entries = await getMemories(db, 'prague')
    expect(entries).toHaveLength(1)
    expect(entries[0].note).toBe('Amazing')
    db.close()
  })

  it('deletes a memory', async () => {
    const db = await openAppDB()
    await addMemory(db, { id: '1', cityId: 'prague', author: 'Iris', timestamp: '2026-06-14T10:00:00Z', location: '', photos: [], note: 'test' })
    await deleteMemory(db, '1')
    const entries = await getMemories(db, 'prague')
    expect(entries).toHaveLength(0)
    db.close()
  })

  it('returns memories sorted newest first', async () => {
    const db = await openAppDB()
    await addMemory(db, { id: '1', cityId: 'prague', author: 'Iris', timestamp: '2026-06-14T08:00:00Z', location: '', photos: [], note: 'earlier' })
    await addMemory(db, { id: '2', cityId: 'prague', author: 'Niko', timestamp: '2026-06-14T12:00:00Z', location: '', photos: [], note: 'later' })
    const entries = await getMemories(db, 'prague')
    expect(entries[0].note).toBe('later')
    db.close()
  })
})
