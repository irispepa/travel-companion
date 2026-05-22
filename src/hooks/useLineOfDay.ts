import { useState, useEffect, useCallback } from 'react'
import { useDb } from '../db/DbContext'
import { CityId } from '../db/schema'
import { getLineOfDay, upsertLineOfDay } from '../db/repositories/linesOfDay'

export function useLineOfDay(cityId: CityId, date: string) {
  const db = useDb()
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getLineOfDay(db, cityId, date)
      .then(line => setText(line?.text ?? ''))
      .finally(() => setLoading(false))
  }, [db, cityId, date])

  const setLine = useCallback(async (newText: string) => {
    setText(newText)
    await upsertLineOfDay(db, {
      id: `${cityId}-${date}`,
      cityId,
      date,
      text: newText,
      updatedAt: new Date().toISOString(),
    })
  }, [db, cityId, date])

  return { text, setLine, loading }
}
