import React, { useRef } from 'react'
import { compressImage } from '../../../../utils/imageCompressor'

type Step = 'picker' | 'note' | 'food' | 'quote' | 'ticket' | 'photo' | 'voice'

interface Props {
  onSelect: (step: Step) => void
  onClose: () => void
  onPhotoSelected: (src: string) => void
}

const TILE_SHADOW = '1.5px 2px 0 var(--color-ink)'
const TILE_BORDER = '1px solid var(--color-ink)'

function CameraGlyph() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h4l2-3h6l2 3h4v11H3z"/>
      <circle cx="12" cy="13.5" r="3.5"/>
    </svg>
  )
}

function ForkKnifeGlyph() {
  return (
    <svg width={9} height={9} viewBox="0 0 16 16" fill="none" stroke="var(--color-stamp)" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 1v4c0 1 1 2 2 2v7"/>
      <path d="M7 1v3"/>
      <path d="M5 1v3"/>
      <path d="M11 1v14"/>
      <path d="M11 1c1.5 0 3 1 3 3s-1.5 3-3 3"/>
    </svg>
  )
}

function MicGlyph() {
  return (
    <svg width={9} height={9} viewBox="0 0 16 16" fill="none" stroke="var(--color-ink)" strokeWidth="1.3" strokeLinecap="round">
      <rect x="6" y="1.5" width="4" height="8" rx="2"/>
      <path d="M3.5 7.5a4.5 4.5 0 009 0"/>
      <path d="M8 12v2.5"/>
      <path d="M6 14.5h4"/>
    </svg>
  )
}

function PhotoTile() {
  return (
    <div style={{
      width: 80, padding: 5, paddingBottom: 14,
      background: 'var(--color-white)', border: TILE_BORDER, borderRadius: 3, boxShadow: TILE_SHADOW,
    }}>
      <div style={{
        width: '100%', height: 56,
        background: 'repeating-linear-gradient(45deg, var(--color-paper-deep), var(--color-paper-deep) 4px, #d0c8b8 4px, #d0c8b8 5px)',
        border: '1px dashed var(--color-ink-faint)',
        display: 'grid', placeItems: 'center',
      }}>
        <CameraGlyph />
      </div>
    </div>
  )
}

function NoteTile() {
  return (
    <div style={{
      width: 84, padding: '8px 8px 10px',
      background: 'var(--color-white)', border: TILE_BORDER, borderRadius: 3, boxShadow: TILE_SHADOW,
    }}>
      {[90, 75, 50].map((w, i) => (
        <div key={i} style={{ height: 3, borderRadius: 1.5, background: 'var(--color-ink-faint)', opacity: 0.6, width: `${w}%`, marginBottom: 4 }} />
      ))}
    </div>
  )
}

function FoodTile() {
  return (
    <div style={{
      width: 88, padding: '6px 8px 8px',
      background: 'var(--color-white)', border: TILE_BORDER, borderRadius: 3, boxShadow: TILE_SHADOW,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
        <ForkKnifeGlyph />
        <div style={{ height: 3, background: 'var(--color-stamp)', opacity: 0.6, width: 38, borderRadius: 1 }} />
      </div>
      <div style={{ borderTop: '1px dashed var(--color-rule)', margin: '5px 0' }} />
      <div style={{ fontFamily: 'var(--font-hand)', fontSize: 12, color: 'var(--color-ink)', lineHeight: 1 }}>dish</div>
    </div>
  )
}

function VoiceTile() {
  const bars = [4, 7, 11, 5, 9, 13, 8, 11, 6, 4, 8, 11, 5]
  return (
    <div style={{
      width: 86, padding: '6px 8px 8px',
      background: 'var(--color-white)', border: TILE_BORDER, borderRadius: 3, boxShadow: TILE_SHADOW,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
        <MicGlyph />
        <div style={{ height: 3, background: 'var(--color-ink-faint)', opacity: 0.6, width: 34, borderRadius: 1 }} />
      </div>
      <div style={{ borderTop: '1px dashed var(--color-rule)', margin: '5px 0' }} />
      <div style={{ display: 'flex', gap: 1.5, height: 14, alignItems: 'center' }}>
        {bars.map((h, i) => (
          <div key={i} style={{ width: 2, height: h, background: 'var(--color-ink)', opacity: 0.45, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  )
}

function TicketTile() {
  return (
    <div style={{
      width: 88, padding: '6px 8px 8px',
      background: 'var(--color-paper-deep)', border: TILE_BORDER, borderRadius: 3, boxShadow: TILE_SHADOW,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 6, letterSpacing: '0.16em', color: 'var(--color-ink-soft)', textTransform: 'uppercase' as const, marginBottom: 2 }}>Ticket</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--color-ink)' }}>
        PRG<span style={{ color: 'var(--color-stamp)' }}>→</span>VIE
      </div>
      <div style={{ borderTop: '1px dashed var(--color-rule)', marginTop: 4 }} />
    </div>
  )
}

function QuoteTile() {
  return (
    <div style={{
      width: 90, height: 60,
      background: 'transparent',
      display: 'grid', placeItems: 'center',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: '4px 0',
        borderTop: '1px dashed var(--color-rule)',
        borderBottom: '1px dashed var(--color-rule)',
        opacity: 0.7,
      }} />
      <div style={{
        fontFamily: 'var(--font-hand)', fontSize: 14, color: 'var(--color-ink)',
        lineHeight: 1.1, transform: 'rotate(-2deg)',
        padding: '0 4px', textAlign: 'center' as const, position: 'relative',
      }}>
        &#8220;line of<br/>the day&#8221;
      </div>
    </div>
  )
}

type TileConfig = { step: Step; label: string; rotation: number; preview: React.ReactNode }

const TILES: TileConfig[] = [
  { step: 'photo',  label: 'Photo',        rotation: -3, preview: <PhotoTile /> },
  { step: 'note',   label: 'Note',         rotation:  2, preview: <NoteTile /> },
  { step: 'food',   label: 'What we ate',  rotation: -2, preview: <FoodTile /> },
  { step: 'voice',  label: 'Voice note',   rotation:  3, preview: <VoiceTile /> },
  { step: 'quote',  label: 'QOTD',         rotation:  3, preview: <QuoteTile /> },
  { step: 'ticket', label: 'Ticket',       rotation: -2, preview: <TicketTile /> },
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 24, columnGap: 8, justifyItems: 'center' }}>
        {TILES.map(t => (
          <button
            key={t.step}
            onClick={() => handleTileClick(t)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transform: `rotate(${t.rotation}deg)`,
              minHeight: 44,
            }}
          >
            {t.preview}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-ink)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        aria-label="Back"
        style={{ marginTop: 'var(--space-lg)', background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', padding: 0 }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6l-6 6 6 6"/></svg>
      </button>
    </div>
  )
}
