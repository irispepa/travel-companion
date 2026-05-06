import React, { useState } from 'react'
import { ItineraryItem } from '../../../db/schema'

interface Props {
  item: ItineraryItem
  onUpdate: (item: ItineraryItem) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function ItineraryCardEdit({ item, onUpdate, onMoveUp, onMoveDown }: Props) {
  const [local, setLocal] = useState(item)
  const field = (key: keyof ItineraryItem) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...local, [key]: e.target.value }
    setLocal(updated)
    onUpdate(updated)
  }
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
        {onMoveUp && <button onClick={onMoveUp} aria-label="move up">↑</button>}
        {onMoveDown && <button onClick={onMoveDown} aria-label="move down">↓</button>}
      </div>
      {(['name', 'time', 'duration', 'location', 'notes'] as const).map(k => (
        <input key={k} value={String(local[k])} onChange={field(k)} placeholder={k}
          style={{ display: 'block', width: '100%', marginBottom: 6, background: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--color-cream)', fontSize: 13 }} />
      ))}
    </div>
  )
}
