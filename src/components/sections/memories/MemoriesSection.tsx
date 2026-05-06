import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CityViewId } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { useMemories } from '../../../hooks/useMemories'
import { AppShell } from '../../layout/AppShell'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'
import { MemoryEntry } from './MemoryEntry'
import { AddMemorySheet } from './AddMemorySheet'

export function MemoriesSection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const { entries, addMemory, deleteMemory } = useMemories(config.cityId)
  const [showAdd, setShowAdd] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [storageWarning, setStorageWarning] = useState(false)

  useEffect(() => {
    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then(({ usage = 0, quota = 1 }) => {
        if (usage / quota > 0.8) setStorageWarning(true)
      })
    }
  }, [])

  return (
    <AppShell cityLabel={config.label} showBack={true} onCalculator={() => setShowCalc(true)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 12px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>Memories</h2>
      </div>
      {storageWarning && (
        <div style={{ background: 'var(--color-bg-card-alt)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', marginBottom: 'var(--space-md)', fontSize: 12, color: 'var(--color-gold)', borderLeft: '3px solid var(--color-gold)' }}>
          Storage is over 80% full — consider exporting photos.
        </div>
      )}
      {entries.length === 0 && (
        <p style={{ color: 'var(--color-muted)', fontSize: 14, textAlign: 'center', marginTop: 40 }}>No memories yet — add your first!</p>
      )}
      {entries.map(entry => (
        <MemoryEntry key={entry.id} entry={entry} onDelete={deleteMemory} />
      ))}
      <button onClick={() => setShowAdd(true)}
        style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: 'var(--color-gold)', color: 'var(--color-bg)', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 10 }}
        aria-label="add memory">
        +
      </button>
      {showAdd && (
        <AddMemorySheet
          onSave={entry => addMemory({ ...entry, id: crypto.randomUUID(), cityId: config.cityId })}
          onClose={() => setShowAdd(false)}
        />
      )}
      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </AppShell>
  )
}
