import React, { createContext, useContext, useEffect, useState } from 'react'
import { openAppDB, AppDB } from './client'
import { loadSeedIfNeeded } from '../seed/loader'

const DbContext = createContext<AppDB | null>(null)

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AppDB | null>(null)

  useEffect(() => {
    openAppDB().then(async (db) => {
      await loadSeedIfNeeded(db)
      setDb(db)
    })
  }, [])

  if (!db) return <div style={{ color: '#e8dcc8', padding: 32 }}>Loading…</div>
  return <DbContext.Provider value={db}>{children}</DbContext.Provider>
}

export function useDb(): AppDB {
  const db = useContext(DbContext)
  if (!db) throw new Error('useDb must be used within DbProvider')
  return db
}
