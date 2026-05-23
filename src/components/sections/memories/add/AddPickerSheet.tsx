import React, { useRef } from 'react'
import { compressImage } from '../../../../utils/imageCompressor'

type Step = 'picker' | 'note' | 'food' | 'quote' | 'ticket' | 'photo' | 'voice'

interface Props {
  onSelect: (step: Step) => void
  onClose: () => void
  onPhotoSelected: (src: string) => void
}

function PhotoTile() {
  return (
    <div style={{ width: 56, height: 56, background: 'var(--color-paper-deep)', border: '1px solid var(--color-ink)', padding: 4 }}>
      <div style={{ width: '100%', height: '100%', background: 'var(--color-rule)', display: 'grid', placeItems: 'center' }}>
        <span style={{ fontSize: 18 }}>📷</span>
      </div>
    </div>
  )
}

function NoteTile() {
  return (
    <div style={{ width: 60, padding: '6px 8px', background: 'var(--color-white)', border: '1px solid var(--color-ink)', borderRadius: 4 }}>
      {[80, 60, 40].map((w, i) => (
        <div key={i} style={{ height: 4, borderRadius: 2, background: 'var(--color-ink-faint)', opacity: 0.5, width: `${w}%`, marginBottom: 4 }} />
      ))}
    </div>
  )
}

function FoodTile() {
  return (
    <div style={{ width: 60, padding: '6px 8px', background: 'var(--color-white)', border: '1px solid var(--color-ink)', borderRadius: 4 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--color-stamp)', letterSpacing: '0.12em' }}>🍴 BEST ATE</div>
    </div>
  )
}

function VoiceTile() {
  return (
    <div style={{ width: 60, padding: '6px 8px', background: 'var(--color-white)', border: '1px solid var(--color-ink)', borderRadius: 4 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--color-ink-soft)', letterSpacing: '0.10em' }}>🎙 VOICE</div>
    </div>
  )
}

function TicketTile() {
  return (
    <div style={{ width: 60, padding: '6px 8px', background: 'var(--color-paper-deep)', border: '1px solid var(--color-ink)', borderRadius: 4 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>
        PRG<span style={{ color: 'var(--color-stamp)' }}>→</span>VIE
      </div>
    </div>
  )
}

function QuoteTile() {
  return (
    <div style={{ width: 72, padding: '4px 6px' }}>
      <span style={{ fontFamily: 'var(--font-hand)', fontSize: 14, color: 'var(--color-ink)' }}>"We got lost."</span>
    </div>
  )
}

type TileConfig = { step: Step; label: string; rotation: number; preview: React.ReactNode }

const TILES: TileConfig[] = [
  { step: 'photo',  label: 'Photo',           rotation: -2, preview: <PhotoTile /> },
  { step: 'note',   label: 'Note',            rotation:  3, preview: <NoteTile /> },
  { step: 'food',   label: 'Best thing ate',  rotation: -3, preview: <FoodTile /> },
  { step: 'voice',  label: 'Voice memo',      rotation:  2, preview: <VoiceTile /> },
  { step: 'ticket', label: 'Ticket',          rotation: -2, preview: <TicketTile /> },
  { step: 'quote',  label: 'Line of the day', rotation:  3, preview: <QuoteTile /> },
]

export function AddPickerSheet({ onSelect, onClose, onPhotoSelected }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const src = await compressImage(file)
    onPhotoSelected(src)
    e.target.value = ''
  }

  function handleTileClick(t: TileConfig) {
    if (t.step === 'photo') {
      fileRef.current?.click()
    } else {
      onSelect(t.step)
    }
  }

  return (
    <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoFile} />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-stamp)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
        STEP 1 · ADD MEMORY
      </p>
      <h2 id="add-memory-title" style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>
        What did you capture?
      </h2>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontStyle: 'italic', color: 'var(--color-ink-soft)', marginBottom: 'var(--space-lg)' }}>
        Pick a kind, or just drag a photo onto the day.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {TILES.map(t => (
          <button
            key={t.step}
            onClick={() => handleTileClick(t)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: 'var(--space-sm)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transform: `rotate(${t.rotation}deg)`,
              minWidth: 80,
              minHeight: 44,
            }}
          >
            {t.preview}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-ink-soft)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        style={{ marginTop: 'var(--space-lg)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-faint)', letterSpacing: '0.08em', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'block' }}
      >
        ← back
      </button>
    </div>
  )
}
