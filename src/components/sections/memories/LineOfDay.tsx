import { useState, useRef } from 'react'

const HAND_DISPLAY = 26

interface Props {
  text: string
  onSave: (text: string) => void
}

export function LineOfDay({ text, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function startEdit() {
    setDraft(text)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commit() {
    const trimmed = draft.trim().slice(0, 80)
    onSave(trimmed)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { setEditing(false); setDraft(text) }
  }

  if (editing) {
    return (
      <textarea
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value.slice(0, 80))}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        maxLength={80}
        rows={2}
        aria-label="Line of the day"
        style={{
          fontFamily: 'var(--font-hand)',
          fontSize: HAND_DISPLAY,
          color: 'var(--color-ink)',
          transform: 'rotate(-1.4deg)',
          transformOrigin: 'left center',
          background: 'transparent',
          border: 'none',
          outline: '2px solid var(--color-stamp)',
          borderRadius: 3,
          width: '100%',
          resize: 'none',
          padding: '2px 4px',
          lineHeight: 1.3,
        }}
      />
    )
  }

  if (!text) {
    return (
      <button
        onClick={startEdit}
        aria-label="Add line of the day"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 10px',
          border: '1px dashed var(--color-rule)',
          borderRadius: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--color-ink-faint)',
          letterSpacing: '0.08em',
          background: 'transparent',
          minHeight: 44,
          cursor: 'pointer',
        }}
      >
        + line of the day
      </button>
    )
  }

  return (
    <button
      onClick={startEdit}
      aria-label={`Line of the day: ${text}. Tap to edit.`}
      style={{
        fontFamily: 'var(--font-hand)',
        fontSize: HAND_DISPLAY,
        color: 'var(--color-ink)',
        transform: 'rotate(-1.4deg)',
        transformOrigin: 'left center',
        background: 'transparent',
        border: 'none',
        textAlign: 'left',
        lineHeight: 1.3,
        cursor: 'text',
        padding: 0,
        minHeight: 44,
        display: 'block',
        width: '100%',
      }}
    >
      "{text}"
    </button>
  )
}
