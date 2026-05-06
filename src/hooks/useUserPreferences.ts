import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityViewId, CurrencyPref } from '../db/schema'
import { getCurrencyPref, setCurrencyPref } from '../db/repositories/userPreferences'

export function useUserPreferences(cityViewId: CityViewId) {
  const db = useDb()
  const [pref, setPrefState] = useState<CurrencyPref | undefined>(undefined)

  useEffect(() => {
    getCurrencyPref(db, cityViewId).then(setPrefState)
  }, [db, cityViewId])

  const setPref = useCallback(async (p: CurrencyPref) => {
    await setCurrencyPref(db, cityViewId, p)
    setPrefState(p)
  }, [db, cityViewId])

  return { pref, setPref }
}
