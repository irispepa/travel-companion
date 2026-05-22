import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { CityId, DayWeather } from '../db/schema'
import { getDayWeather } from '../db/repositories/dayWeather'

export function useDayWeather(cityId: CityId, date: string) {
  const db = useDb()
  const [weather, setWeather] = useState<DayWeather | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getDayWeather(db, cityId, date)
      .then(setWeather)
      .finally(() => setLoading(false))
  }, [db, cityId, date])

  return { weather, loading }
}
