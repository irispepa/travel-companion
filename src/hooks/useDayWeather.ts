import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, DayWeather } from '../db/schema'
import { getDayWeather, upsertDayWeather } from '../db/repositories/dayWeather'
import { fetchWeather } from '../utils/fetchWeather'

export function useDayWeather(cityId: CityId, date: string) {
  const db = useDb()
  const [weather, setWeather] = useState<DayWeather | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function load() {
      // Cache-first: return immediately if we already have an entry
      const cached = await getDayWeather(db, cityId, date)
      if (cached) {
        if (!cancelled) {
          setWeather(cached)
          setLoading(false)
        }
        return
      }

      // Fetch on miss
      const result = await fetchWeather(cityId, date)
      if (!cancelled) {
        if (result) {
          const entry: DayWeather = {
            id: `${cityId}-${date}`,
            cityId,
            date,
            kind: result.kind,
            temp: result.temp,
            fetchedAt: new Date().toISOString(),
          }
          await upsertDayWeather(db, entry)
          setWeather(entry)
        }
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [db, cityId, date])

  return { weather, loading }
}
