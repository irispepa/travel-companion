import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityViewId, ItineraryRecord, ItineraryItem } from '../db/schema'
import { getItinerary, saveItinerary } from '../db/repositories/itinerary'

export function useItinerary(cityViewId: CityViewId) {
  const db = useDb()
  const [record, setRecord] = useState<ItineraryRecord | null>(null)

  useEffect(() => {
    getItinerary(db, cityViewId).then(r => setRecord(r ?? null))
  }, [db, cityViewId])

  const updateItem = useCallback(async (date: string, item: ItineraryItem) => {
    if (!record) return
    const updated = {
      ...record,
      days: record.days.map(d =>
        d.date === date
          ? { ...d, items: d.items.map(i => i.id === item.id ? item : i) }
          : d
      )
    }
    await saveItinerary(db, updated)
    setRecord(updated)
  }, [db, record])

  const addItem = useCallback(async (date: string, item: ItineraryItem) => {
    if (!record) return
    const updated = {
      ...record,
      days: record.days.map(d =>
        d.date === date ? { ...d, items: [...d.items, item] } : d
      )
    }
    await saveItinerary(db, updated)
    setRecord(updated)
  }, [db, record])

  const reorderItems = useCallback(async (date: string, items: ItineraryItem[]) => {
    if (!record) return
    const updated = {
      ...record,
      days: record.days.map(d => d.date === date ? { ...d, items } : d)
    }
    await saveItinerary(db, updated)
    setRecord(updated)
  }, [db, record])

  return { record, updateItem, addItem, reorderItems }
}
