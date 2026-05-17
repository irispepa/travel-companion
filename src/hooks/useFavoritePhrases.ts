import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityId } from '../db/schema'
import { getFavoritePhrases, toggleFavoritePhrase } from '../db/repositories/userPreferences'

export function useFavoritePhrases(cityId: CityId) {
  const db = useDb()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    getFavoritePhrases(db, cityId).then(list => setFavorites(new Set(list)))
  }, [db, cityId])

  const toggle = useCallback((english: string) => {
    return toggleFavoritePhrase(db, cityId, english).then(() => {
      setFavorites(prev => {
        const next = new Set(prev)
        if (next.has(english)) next.delete(english)
        else next.add(english)
        return next
      })
    })
  }, [db, cityId])

  return { favorites, toggle }
}
