import React, { useState } from 'react'
import { NoteMemory } from '../../../../db/schema'
import { useCaptured } from '../../../../hooks/useCaptured'

type SaveArg = Omit<NoteMemory, 'id' | 'cityId'>

interface Props {
  onSave: (entry: SaveArg) => void
  onClose: () => void
  onBack: () => void
}

const AUTHORS: Array<NoteMemory['author']> = ['Iris', 'Niko', 'both']

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}

export function AddNoteSheet({ onSave, onClose, onBack }: Props) {
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState<NoteMemory['author']>('Iris')
  const [tone, setTone] = useState<NoteMemory['tone']>('white')
  const { captured, trigger } = useCaptured(onClose)

  function handleSave() {
    if (!body.trim()) return
    trigger(() => onSave({ kind: 'note', author, body: body.trim(), tone, timestamp: new Date().toISOString() }))
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        NOTE
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
        <button
          onClick={() => setTone(t => t === 'cream' ? 'white' : 'cream')}
          style={{
            padding: '0 10px',
            height: 36,
            borderRadius: 20,
            border: '1px solid var(--color-rule)',
            background: tone === 'cream' ? '#f3e2c1' : 'var(--color-white)',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--color-ink-soft)',
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          {tone === 'cream' ? '🟡 cream' : '⬜ white'}
        </button>
      </div>

      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="what happened?"
        rows={5}
        aria-label="Note body"
        style={{
          width: '100%',
          fontFamily: 'var(--font-hand)',
          fontSize: 20,
          color: 'var(--color-ink)',
          background: tone === 'cream' ? '#f3e2c1' : 'var(--color-white)',
          border: '1px solid var(--color-ink)',
          borderRadius: 4,
          padding: '10px 12px',
          resize: 'none',
          lineHeight: 1.4,
          boxSizing: 'border-box',
        }}
      />

      <button onClick={handleSave} disabled={!body.trim()} style={{ ...STAMP_BUTTON, opacity: body.trim() ? 1 : 0.5, ...(captured ? { background: 'var(--color-ink)', color: 'var(--color-white)', boxShadow: 'none', transform: 'rotate(0deg) scale(0.97)' } : {}) }}>
        {captured ? '✓ CAPTURED' : 'CAPTURE'}
      </button>

      <button onClick={onBack} aria-label="Back" style={{ marginTop: 'var(--space-md)', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', padding: 0 }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6l-6 6 6 6"/></svg>
      </button>
    </div>
  )
}
