import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, ActivityItem } from '../db/schema'
import { getActivities, saveActivities } from '../db/repositories/activities'

export function useActivities(cityId: CityId) {
  const db = useDb()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getActivities(db, cityId)
      .then(r => setItems(r?.items ?? []))
      .finally(() => setLoading(false))
  }, [db, cityId])

  const persist = useCallback((next: ActivityItem[]) => {
    setItems(next)
    saveActivities(db, cityId, next).catch(console.error)
  }, [db, cityId])

  const updateItem = useCallback((id: string, patch: Partial<ActivityItem>) => {
    setItems(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...patch } : a)
      saveActivities(db, cityId, next).catch(console.error)
      return next
    })
  }, [db, cityId])

  const addItem = useCallback((item: ActivityItem) => {
    setItems(prev => {
      const next = [...prev, item]
      saveActivities(db, cityId, next).catch(console.error)
      return next
    })
  }, [db, cityId])

  const deleteItem = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(a => a.id !== id)
      saveActivities(db, cityId, next).catch(console.error)
      return next
    })
  }, [db, cityId])

  const reorderItems = useCallback((next: ActivityItem[]) => {
    persist(next)
  }, [persist])

  return { items, loading, updateItem, addItem, deleteItem, reorderItems }
}
