import { useState, useEffect } from 'react'
import { useDb } from '../db/DbContext'
import { getCachedRate, setCachedRate } from '../db/repositories/exchangeRates'

const TODAY = new Date().toISOString().slice(0, 10)

export function useExchangeRate(from: string, to: string) {
  const db = useDb()
  const pair = `${from}-${to}`
  const [rate, setRate] = useState<number | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [rateDate, setRateDate] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const cached = await getCachedRate(db, pair)
      if (cached && cached.fetchedAt === TODAY) {
        setRate(cached.rate); setRateDate(cached.fetchedAt); return
      }
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`)
        const data = await res.json()
        const r = data.rates[to]
        await setCachedRate(db, { pair, rate: r, fetchedAt: TODAY })
        setRate(r); setRateDate(TODAY); setIsOffline(false)
      } catch (_e) {
        if (cached) { setRate(cached.rate); setRateDate(cached.fetchedAt); setIsOffline(true) }
      }
    }
    load()
  }, [db, pair, from, to])

  return { rate, isOffline, rateDate }
}
