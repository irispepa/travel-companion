import React, { useState } from 'react'
import { CityId } from '../../../../db/schema'
import { useLineOfDay } from '../../../../hooks/useLineOfDay'
import { useCaptured } from '../../../../hooks/useCaptured'

interface Props {
  cityId: CityId
  date: string
  onClose: () => void
  onBack: () => void
}

const MAX_CHARS = 80

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}

export function AddQuoteSheet({ cityId, date, onClose, onBack }: Props) {
  const { setLine } = useLineOfDay(cityId, date)
  const [text, setText] = useState('')
  const { captured, trigger } = useCaptured(onClose)

  const trimmed = text.trim()
  const remaining = MAX_CHARS - text.length
  const overLimit = remaining < 0

  function handleSave() {
    if (!trimmed || overLimit) return
    trigger(() => { setLine(trimmed) })
  }

  // Format date as e.g. "Thu 22 May 2026"
  const formatted = (() => {
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
      })
    } catch {
      return date
    }
  })()

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        LINE OF THE DAY
      </p>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-soft)', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
        {formatted}
      </p>

      <div style={{ position: 'relative' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="something someone said…"
          rows={3}
          aria-label="Quote text"
          maxLength={MAX_CHARS + 20}
          style={{
            width: '100%',
            fontFamily: 'var(--font-hand)',
            fontSize: 26,
            color: 'var(--color-ink)',
            background: 'var(--color-white)',
            border: '1px solid var(--color-ink)',
            borderRadius: 4,
            padding: '10px 12px',
            resize: 'none',
            lineHeight: 1.3,
            boxSizing: 'border-box',
            transform: 'rotate(-1deg)',
          }}
        />
        <span
          aria-label="Character count"
          style={{
            position: 'absolute',
            bottom: 8,
            right: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: overLimit ? 'var(--color-stamp)' : 'var(--color-ink-faint)',
            letterSpacing: '0.06em',
          }}
        >
          {remaining}
        </span>
      </div>

      <button
        onClick={handleSave}
        disabled={!trimmed || overLimit}
        style={{ ...STAMP_BUTTON, opacity: trimmed && !overLimit ? 1 : 0.5, ...(captured ? { background: 'var(--color-ink)', color: 'var(--color-white)', boxShadow: 'none', transform: 'rotate(0deg) scale(0.97)' } : {}) }}
      >
        {captured ? '✓ CAPTURED' : 'CAPTURE'}
      </button>

      <button
        onClick={onBack}
        aria-label="Back"
        style={{ marginTop: 'var(--space-md)', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', padding: 0 }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6l-6 6 6 6"/></svg>
      </button>
    </div>
  )
}
