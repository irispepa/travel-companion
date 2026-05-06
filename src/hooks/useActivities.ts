import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, ActivityItem } from '../db/schema'
import { getActivities } from '../db/repositories/activities'

type SortKey = 'priority' | 'cost' | 'timeEstimate'

export function useActivities(cityId: CityId) {
  const db = useDb()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('priority')

  useEffect(() => {
    getActivities(db, cityId).then(r => setItems(r?.items ?? []))
  }, [db, cityId])

  return { items, sortKey, setSortKey }
}
