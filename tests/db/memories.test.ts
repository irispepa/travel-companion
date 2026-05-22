import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { openAppDB } from '../../src/db/client'
import { getMemories, addMemory, deleteMemory } from '../../src/db/repositories/memories'
import type { PhotoMemory, NoteMemory } from '../../src/db/schema'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))
afterEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('getMemories', () => {
  it('returns empty array for city with no memories', async () => {
    const db = await openAppDB()
    const result = await getMemories(db, 'prague')
    db.close()
    expect(result).toEqual([])
  })

  it('returns memories filtered by cityId', async () => {
    const db = await openAppDB()
    const photo: PhotoMemory = {
      id: '1', cityId: 'prague', kind: 'photo', author: 'Iris',
      timestamp: '2026-06-14T10:00:00Z', photoSrc: 'data:image/jpeg;base64,abc'
    }
    const note: NoteMemory = {
      id: '2', cityId: 'vienna', kind: 'note', author: 'Niko',
      timestamp: '2026-06-15T10:00:00Z', body: 'Hello Vienna'
    }
    await addMemory(db, photo)
    await addMemory(db, note)
    const prague = await getMemories(db, 'prague')
    db.close()
    expect(prague).toHaveLength(1)
    expect(prague[0].id).toBe('1')
  })

  it('applies kind migration shim to old records without kind', async () => {
    const db = await openAppDB()
    await db.put('memories', {
      id: 'old', cityId: 'prague', author: 'Iris',
      timestamp: '2026-06-14T09:00:00Z', photos: [], note: 'old note', location: ''
    })
    const result = await getMemories(db, 'prague')
    db.close()
    expect(result[0]).toMatchObject({ id: 'old', kind: 'photo' })
  })

  it('sorts entries reverse-chronologically', async () => {
    const db = await openAppDB()
    const a: NoteMemory = { id: 'a', cityId: 'prague', kind: 'note', author: 'Iris', timestamp: '2026-06-14T08:00:00Z', body: 'morning' }
    const b: NoteMemory = { id: 'b', cityId: 'prague', kind: 'note', author: 'Niko', timestamp: '2026-06-14T20:00:00Z', body: 'evening' }
    await addMemory(db, a)
    await addMemory(db, b)
    const result = await getMemories(db, 'prague')
    db.close()
    expect(result[0].id).toBe('b')
    expect(result[1].id).toBe('a')
  })
})

describe('deleteMemory', () => {
  it('removes a memory by id', async () => {
    const db = await openAppDB()
    const note: NoteMemory = { id: 'del', cityId: 'prague', kind: 'note', author: 'Iris', timestamp: '2026-06-14T10:00:00Z', body: 'to delete' }
    await addMemory(db, note)
    await deleteMemory(db, 'del')
    const result = await getMemories(db, 'prague')
    db.close()
    expect(result).toHaveLength(0)
  })
})
