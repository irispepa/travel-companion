import React, { useState, useRef } from 'react'
import { MemoryEntry } from '../../../db/schema'
import { compressImage } from '../../../utils/imageCompressor'

const AUTHORS = ['Iris', 'Niko']

interface Props {
  onSave: (entry: Omit<MemoryEntry, 'id' | 'cityId'>) => void
  onClose: () => void
}

export function AddMemorySheet({ onSave, onClose }: Props) {
  const [author, setAuthor] = useState(AUTHORS[0])
  const [note, setNote] = useState('')
  const [location, setLocation] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - photos.length)
    const compressed = await Promise.all(files.map(f => compressImage(f)))
    setPhotos(prev => [...prev, ...compressed])
  }

  function handleSave() {
    onSave({ author, note, location, photos, timestamp: new Date().toISOString() })
    onClose()
  }

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
    color: 'var(--color-muted)',
    fontSize: 'var(--text-caption)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginBottom: 'var(--space-md)',
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--color-bg-card)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 12px',
    color: 'var(--color-cream)',
    fontSize: 'var(--text-body)',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 'var(--z-sheet)',
        animation: 'backdropFadeIn var(--duration-base) var(--ease-out-expo) both',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-memory-title"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: 'var(--space-lg)',
          paddingBottom: 'calc(var(--space-lg) + env(safe-area-inset-bottom, 0px))',
          maxHeight: '90vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: 'sheetSlideUp var(--duration-sheet) var(--ease-out-expo) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          id="add-memory-title"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-headline)',
            fontWeight: 400,
            marginBottom: 'var(--space-lg)',
          }}
        >
          Add Memory
        </h2>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
          {AUTHORS.map(a => (
            <button
              key={a}
              onClick={() => setAuthor(a)}
              aria-pressed={author === a}
              style={{
                padding: '0 var(--space-md)',
                height: 36,
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-body)',
                background: author === a ? 'var(--color-gold)' : 'var(--color-bg-card)',
                color: author === a ? 'var(--color-bg)' : 'var(--color-cream)',
                transition: `background var(--duration-fast) var(--ease-out-expo)`,
              }}
            >
              {a}
            </button>
          ))}
        </div>

        <label htmlFor="memory-note" style={labelStyle}>
          Note
          <textarea
            id="memory-note"
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ ...inputStyle, resize: 'none', minHeight: 80 }}
          />
        </label>

        <label htmlFor="memory-location" style={labelStyle}>
          Location
          <input
            id="memory-location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="optional"
            style={inputStyle}
          />
        </label>

        {photos.length < 5 && (
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100%',
              padding: 'var(--space-sm)',
              background: 'var(--color-bg-card-alt)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-gold)',
              fontSize: 'var(--text-body)',
              marginBottom: 'var(--space-md)',
              minHeight: 44,
            }}
          >
            + Add Photos ({photos.length}/5)
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFiles} />

        {photos.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            overflowX: 'auto',
            marginBottom: 'var(--space-md)',
          }}>
            {photos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Selected photo ${i + 1}`}
                style={{ height: 80, borderRadius: 'var(--radius-sm)', flexShrink: 0, objectFit: 'cover' }}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            background: 'var(--color-gold)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-bg)',
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-title)',
            fontWeight: 600,
          }}
        >
          Save Memory
        </button>
      </div>
    </div>
  )
}
