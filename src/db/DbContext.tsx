import React, { createContext, useContext, useEffect, useState } from 'react'
import { openAppDB, AppDB } from './client'
import { loadSeedIfNeeded } from '../seed/loader'

const DbContext = createContext<AppDB | null>(null)

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AppDB | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    openAppDB().then(async (db) => {
      await loadSeedIfNeeded(db)
      setDb(db)
    }).catch(() => setError(true))
  }, [])

  if (error) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 32,
      gap: 16,
      textAlign: 'center',
    }}>
      <p style={{ color: '#e8dcc8', fontSize: 17, fontFamily: 'Georgia, serif' }}>
        Could not open storage
      </p>
      <p style={{ color: '#5a6a7a', fontSize: 13, lineHeight: 1.5 }}>
        This app requires local storage. If you are in private browsing mode, try opening it in a regular tab.
      </p>
    </div>
  )

  if (!db) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}>
      <div style={{ color: '#5a6a7a', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Loading
      </div>
    </div>
  )

  return <DbContext.Provider value={db}>{children}</DbContext.Provider>
}

export function useDb(): AppDB {
  const db = useContext(DbContext)
  if (!db) throw new Error('useDb must be used within DbProvider')
  return db
}
