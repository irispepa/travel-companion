import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, MemoryEntry } from '../db/schema'
import { getMemories, addMemory as dbAdd, deleteMemory as dbDelete } from '../db/repositories/memories'

export function useMemories(cityId: CityId) {
  const db = useDb()
  const [entries, setEntries] = useState<MemoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getMemories(db, cityId)
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [db, cityId])

  const addMemory = useCallback(async (entry: MemoryEntry) => {
    await dbAdd(db, entry)
    setEntries(await getMemories(db, cityId))
  }, [db, cityId])

  const deleteMemory = useCallback(async (id: string) => {
    await dbDelete(db, id)
    setEntries(await getMemories(db, cityId))
  }, [db, cityId])

  return { entries, addMemory, deleteMemory, loading }
}
