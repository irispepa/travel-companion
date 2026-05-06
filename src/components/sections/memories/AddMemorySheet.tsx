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

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }} onClick={onClose}>
      <div style={{ background: 'var(--color-bg)', borderRadius: '16px 16px 0 0', padding: 'var(--space-lg)', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-md)' }}>Add Memory</h2>

        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-md)' }}>
          {AUTHORS.map(a => (
            <button key={a} onClick={() => setAuthor(a)}
              style={{ padding: '6px 16px', borderRadius: 20, fontSize: 13,
                background: author === a ? 'var(--color-gold)' : 'var(--color-bg-card)',
                color: author === a ? 'var(--color-bg)' : 'var(--color-cream)' }}>
              {a}
            </button>
          ))}
        </div>

        <label aria-label="note" style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--color-muted)', fontSize: 11, letterSpacing: 1, marginBottom: 'var(--space-md)' }}>
          NOTE
          <textarea value={note} onChange={e => setNote(e.target.value)}
            style={{ background: 'var(--color-bg-card)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--color-cream)', fontSize: 14, resize: 'none', minHeight: 80 }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--color-muted)', fontSize: 11, letterSpacing: 1, marginBottom: 'var(--space-md)' }}>
          LOCATION (optional)
          <input value={location} onChange={e => setLocation(e.target.value)}
            style={{ background: 'var(--color-bg-card)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: 'var(--color-cream)', fontSize: 14 }} />
        </label>

        {photos.length < 5 && (
          <button onClick={() => fileRef.current?.click()}
            style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--color-bg-card-alt)', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold)', fontSize: 13, marginBottom: 'var(--space-md)' }}>
            + Add Photos ({photos.length}/5)
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFiles} />

        {photos.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 'var(--space-md)' }}>
            {photos.map((src, i) => (
              <img key={i} src={src} alt="" style={{ height: 80, borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
            ))}
          </div>
        )}

        <button onClick={handleSave} aria-label="save"
          style={{ width: '100%', padding: 'var(--space-md)', background: 'var(--color-gold)', borderRadius: 'var(--radius-md)', color: 'var(--color-bg)', fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600 }}>
          Save Memory
        </button>
      </div>
    </div>
  )
}
