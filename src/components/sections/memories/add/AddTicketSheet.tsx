import React, { useState } from 'react'
import { TicketMemory } from '../../../../db/schema'
import { useCaptured } from '../../../../hooks/useCaptured'

type SaveArg = Omit<TicketMemory, 'id' | 'cityId'>

interface Props {
  onSave: (entry: SaveArg) => void
  onClose: () => void
  onBack: () => void
}

const AUTHORS: Array<TicketMemory['author']> = ['Iris', 'Niko', 'both']

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
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

const MONO_INPUT: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-mono)',
  fontSize: 15,
  color: 'var(--color-ink)',
  background: 'var(--color-white)',
  border: '1px solid var(--color-ink)',
  borderRadius: 4,
  padding: '8px 10px',
  boxSizing: 'border-box',
  letterSpacing: '0.08em',
}

const HAND_INPUT: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-hand)',
  fontSize: 17,
  color: 'var(--color-ink)',
  background: 'var(--color-white)',
  border: '1px solid var(--color-ink)',
  borderRadius: 4,
  padding: '8px 10px',
  boxSizing: 'border-box',
  lineHeight: 1.4,
}

export function AddTicketSheet({ onSave, onClose, onBack }: Props) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [line, setLine] = useState('')
  const [caption, setCaption] = useState('')
  const [author, setAuthor] = useState<TicketMemory['author']>('Iris')

  const canSave = from.trim() && to.trim()
  const { captured, trigger } = useCaptured(onClose)

  function handleSave() {
    if (!canSave) return
    const entry: SaveArg = {
      kind: 'ticket',
      author,
      from: from.trim(),
      to: to.trim(),
      date: date.trim(),
      time: time.trim(),
      timestamp: new Date().toISOString(),
    }
    if (line.trim()) entry.line = line.trim()
    if (caption.trim()) entry.caption = caption.trim()
    trigger(() => onSave(entry))
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        TICKET
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <div>
          <label style={LABEL_STYLE}>FROM</label>
          <input
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder="PRG"
            aria-label="From"
            style={MONO_INPUT}
          />
        </div>
        <div>
          <label style={LABEL_STYLE}>TO</label>
          <input
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="VIE"
            aria-label="To"
            style={MONO_INPUT}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <div>
          <label style={LABEL_STYLE}>DATE</label>
          <input
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="May 25"
            aria-label="Date"
            style={MONO_INPUT}
          />
        </div>
        <div>
          <label style={LABEL_STYLE}>TIME</label>
          <input
            value={time}
            onChange={e => setTime(e.target.value)}
            placeholder="08:42"
            aria-label="Time"
            style={MONO_INPUT}
          />
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <label style={{ ...LABEL_STYLE, color: 'var(--color-ink-soft)' }}>LINE (optional)</label>
        <input
          value={line}
          onChange={e => setLine(e.target.value)}
          placeholder="EC 173"
          aria-label="Line"
          style={MONO_INPUT}
        />
      </div>

      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <label style={{ ...LABEL_STYLE, color: 'var(--color-ink-soft)' }}>CAPTION (optional)</label>
        <input
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="what a ride"
          aria-label="Caption"
          style={HAND_INPUT}
        />
      </div>

      <button onClick={handleSave} disabled={!canSave} style={{ ...STAMP_BUTTON, opacity: canSave ? 1 : 0.5, ...(captured ? { background: 'var(--color-ink)', color: 'var(--color-white)', boxShadow: 'none', transform: 'rotate(0deg) scale(0.97)' } : {}) }}>
        {captured ? '✓ CAPTURED' : 'CAPTURE'}
      </button>

      <button onClick={onBack} aria-label="Back" style={{ marginTop: 'var(--space-md)', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', padding: 0 }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6l-6 6 6 6"/></svg>
      </button>
    </div>
  )
}
