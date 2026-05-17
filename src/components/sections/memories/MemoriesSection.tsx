import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CityViewId } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { useMemories } from '../../../hooks/useMemories'
import { AppShell } from '../../layout/AppShell'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'
import { MemoryEntry } from './MemoryEntry'
import { AddMemorySheet } from './AddMemorySheet'
import { SkeletonList } from '../../layout/SkeletonList'

export function MemoriesSection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const { entries, addMemory, deleteMemory, loading } = useMemories(config.cityId)
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
      <div style={{ padding: 'var(--space-lg) var(--space-md)', paddingBottom: 88, background: 'var(--color-paper)' }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--color-stamp)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            {config.label}
          </p>
          <h2 style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-ink)',
            letterSpacing: '-0.01em',
          }}>
            Memories
          </h2>
        </div>

        {storageWarning && (
          <div style={{
            background: 'var(--color-paper-deep)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-rule)',
            padding: 'var(--space-sm) var(--space-md)',
            marginBottom: 'var(--space-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--color-stamp)',
            letterSpacing: '0.04em',
          }}>
            Storage is over 80% full — consider exporting photos.
          </div>
        )}

        {loading && <SkeletonList rows={3} rowHeight={120} />}
        {!loading && entries.length === 0 && (
          <p style={{
            color: 'var(--color-ink-faint)',
            fontSize: 'var(--text-body)',
            textAlign: 'center',
            paddingTop: 'var(--space-xl)',
          }}>
            Nothing captured yet. Add your first memory.
          </p>
        )}

        {!loading && entries.map((entry, idx) => (
          <MemoryEntry key={entry.id} entry={entry} onDelete={deleteMemory} index={idx} />
        ))}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        aria-label="Add memory"
        style={{
          position: 'fixed',
          bottom: 'var(--space-lg)',
          right: 'var(--space-lg)',
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-stamp)',
          color: '#fff',
          fontSize: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 'var(--z-fab)',
          lineHeight: 1,
        }}
      >
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
