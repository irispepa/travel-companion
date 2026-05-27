import React, { useState } from 'react'
import { FoodMemory } from '../../../../db/schema'
import { FoodCard } from '../cards/FoodCard'

type SaveArg = Omit<FoodMemory, 'id' | 'cityId'>

interface Props {
  onSave: (entry: SaveArg) => void
  onBack: () => void
}

const AUTHORS: Array<FoodMemory['author']> = ['Iris', 'Niko', 'both']

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-hand)',
  fontSize: 18,
  color: 'var(--color-ink)',
  background: 'var(--color-white)',
  border: '1px solid var(--color-ink)',
  borderRadius: 4,
  padding: '8px 10px',
  boxSizing: 'border-box',
  lineHeight: 1.4,
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  color: 'var(--color-stamp)',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 4,
}

export function AddFoodSheet({ onSave, onBack }: Props) {
  const [dish, setDish] = useState('')
  const [note, setNote] = useState('')
  const [author, setAuthor] = useState<FoodMemory['author']>('Iris')

  const previewEntry: FoodMemory = {
    id: 'preview',
    cityId: 'prague',
    kind: 'food',
    author,
    dish: dish || 'dish name',
    note,
    timestamp: new Date().toISOString(),
  }

  function handleSave() {
    if (!dish.trim()) return
    onSave({ kind: 'food', author, dish: dish.trim(), note: note.trim(), timestamp: new Date().toISOString() })
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        WHAT WE ATE
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-md)' }}>
        {AUTHORS.map(a => (
          <button
            key={a}
            onClick={() => setAuthor(a)}
            aria-pressed={author === a}
            style={{
              padding: '0 14px',
              height: 36,
              borderRadius: 20,
              border: '1px solid var(--color-ink)',
              background: author === a ? 'var(--color-ink)' : 'transparent',
              color: author === a ? 'var(--color-paper)' : 'var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            {a === 'both' ? 'Both' : a}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <label style={LABEL_STYLE}>DISH</label>
        <input
          value={dish}
          onChange={e => setDish(e.target.value)}
          placeholder="what was it called?"
          aria-label="Dish name"
          style={INPUT_STYLE}
        />
      </div>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <label style={LABEL_STYLE}>NOTE</label>
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="what made it special?"
          aria-label="Food note"
          style={INPUT_STYLE}
        />
      </div>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <p style={{ ...LABEL_STYLE, marginBottom: 8 }}>PREVIEW</p>
        <FoodCard entry={previewEntry} width={240} />
      </div>

      <button onClick={handleSave} disabled={!dish.trim()} style={{ ...STAMP_BUTTON, opacity: dish.trim() ? 1 : 0.5 }}>
        PASTE IT IN
      </button>

      <button onClick={onBack} style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}>
        ← back
      </button>
    </div>
  )
}
