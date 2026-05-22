import React from 'react'
import { PhotoMemory } from '../../../../db/schema'

const HAND_CAPTION = 13

interface Props {
  entry: PhotoMemory
  width: number
}

const CARD_BASE: React.CSSProperties = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-ink)',
  borderRadius: 4,
  boxShadow: '2px 3px 0 var(--color-ink)',
}

export function PhotoCard({ entry, width }: Props) {
  return (
    <div
      aria-label={entry.caption ? `Photo: ${entry.caption}` : 'Photo memory'}
      style={{ ...CARD_BASE, width, padding: 8, paddingBottom: 28, display: 'inline-block' }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          background: 'var(--color-paper-deep)',
          overflow: 'hidden',
        }}
      >
        <img
          src={entry.photoSrc}
          alt={entry.caption ?? 'Memory photo'}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
      <div
        style={{
          marginTop: 4,
          transform: 'rotate(-1.2deg)',
          transformOrigin: 'left center',
          paddingLeft: 3,
          fontFamily: 'var(--font-hand)',
          fontSize: HAND_CAPTION,
          lineHeight: 1.2,
          minHeight: 16,
        }}
      >
        {entry.caption
          ? <span style={{ color: 'var(--color-ink)', opacity: 0.85 }}>{entry.caption}</span>
          : <span style={{ color: 'var(--color-ink-faint)', opacity: 0.4 }}>add a caption…</span>
        }
      </div>
    </div>
  )
}
