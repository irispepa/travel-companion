import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, ActivityItem } from '../db/schema'
import { getActivities } from '../db/repositories/activities'

type SortKey = 'priority' | 'cost' | 'timeEstimate'

export function useActivities(cityId: CityId) {
  const db = useDb()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getActivities(db, cityId)
      .then(r => setItems(r?.items ?? []))
      .finally(() => setLoading(false))
  }, [db, cityId])

  return { items, sortKey, setSortKey, loading }
}
