import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { openAppDB } from '../../../src/db/client'
import { getMemories, addMemory, deleteMemory } from '../../../src/db/repositories/memories'
import type { NoteMemory } from '../../../src/db/schema'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))
afterEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('memories repository', () => {
  it('adds and retrieves a memory', async () => {
    const db = await openAppDB()
    const note: NoteMemory = { id: '1', cityId: 'prague', kind: 'note', author: 'Iris', timestamp: '2026-06-14T10:00:00Z', location: 'Prague Castle', body: 'Amazing' }
    await addMemory(db, note)
    const entries = await getMemories(db, 'prague')
    expect(entries).toHaveLength(1)
    const entry = entries[0]
    if (entry.kind === 'note') expect(entry.body).toBe('Amazing')
    db.close()
  })

  it('deletes a memory', async () => {
    const db = await openAppDB()
    const note: NoteMemory = { id: '1', cityId: 'prague', kind: 'note', author: 'Iris', timestamp: '2026-06-14T10:00:00Z', location: '', body: 'test' }
    await addMemory(db, note)
    await deleteMemory(db, '1')
    const entries = await getMemories(db, 'prague')
    expect(entries).toHaveLength(0)
    db.close()
  })

  it('returns memories sorted newest first', async () => {
    const db = await openAppDB()
    const a: NoteMemory = { id: '1', cityId: 'prague', kind: 'note', author: 'Iris', timestamp: '2026-06-14T08:00:00Z', body: 'earlier' }
    const b: NoteMemory = { id: '2', cityId: 'prague', kind: 'note', author: 'Niko', timestamp: '2026-06-14T12:00:00Z', body: 'later' }
    await addMemory(db, a)
    await addMemory(db, b)
    const entries = await getMemories(db, 'prague')
    const first = entries[0]
    if (first.kind === 'note') expect(first.body).toBe('later')
    db.close()
  })
})
