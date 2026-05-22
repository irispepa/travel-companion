import React, { useState } from 'react'
import { PhotoMemory } from '../../../../db/schema'

type SaveArg = Omit<PhotoMemory, 'id' | 'cityId'>

interface Props {
  src: string
  onSave: (entry: SaveArg) => void
  onBack: () => void
}

const AUTHORS: Array<PhotoMemory['author']> = ['Iris', 'Niko', 'both']

const STAMP_BUTTON: React.CSSProperties = {
  display: 'block', width: '100%', padding: 'var(--space-md)',
  background: 'var(--color-stamp)', color: 'var(--color-white)',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  border: '1px solid var(--color-ink)', borderRadius: 4,
  boxShadow: '2px 2px 0 var(--color-ink)', transform: 'rotate(-2deg)',
  cursor: 'pointer', marginTop: 'var(--space-md)', minHeight: 48,
}

export function AddPhotoSheet({ src, onSave, onBack }: Props) {
  const [caption, setCaption] = useState('')
  const [author, setAuthor] = useState<PhotoMemory['author']>('Iris')

  function handleSave() {
    onSave({
      kind: 'photo',
      author,
      photoSrc: src,
      caption: caption.trim() || undefined,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        PHOTO
      </p>

      <div style={{ marginBottom: 'var(--space-md)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--color-ink)' }}>
        <img
          src={src}
          alt="Photo preview"
          style={{ display: 'block', width: '100%', maxHeight: 260, objectFit: 'cover' }}
        />
      </div>

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

      <textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        placeholder="add a caption…"
        rows={3}
        aria-label="Caption"
        style={{
          width: '100%',
          fontFamily: 'var(--font-hand)',
          fontSize: 18,
          color: 'var(--color-ink)',
          background: 'var(--color-white)',
          border: '1px solid var(--color-ink)',
          borderRadius: 4,
          padding: '10px 12px',
          resize: 'none',
          lineHeight: 1.4,
          boxSizing: 'border-box',
        }}
      />

      <button onClick={handleSave} style={STAMP_BUTTON}>
        PASTE IT IN
      </button>

      <button
        onClick={onBack}
        style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}
      >
        ← back
      </button>
    </div>
  )
}
