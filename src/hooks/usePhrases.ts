import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, PhrasesRecord } from '../db/schema'
import { getPhrases } from '../db/repositories/phrases'

export function usePhrases(cityId: CityId) {
  const db = useDb()
  const [record, setRecord] = useState<PhrasesRecord | null>(null)

  useEffect(() => {
    getPhrases(db, cityId).then(r => setRecord(r ?? null))
  }, [db, cityId])

  return { categories: record?.categories ?? [] }
}
