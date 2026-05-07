import { useState, useEffect, useRef } from 'react'
import { MemoryEntry as MemoryEntryType } from '../../../db/schema'

interface Props { entry: MemoryEntryType; onDelete: (id: string) => void; index?: number }

export function MemoryEntry({ entry, onDelete, index = 0 }: Props) {
  const date = new Date(entry.timestamp)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleDeleteTap() {
    if (confirmDelete) {
      onDelete(entry.id)
    } else {
      setConfirmDelete(true)
      resetTimer.current = setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current) }, [])
  return (
    <div style={{
      background: 'var(--color-bg-card)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      marginBottom: 'var(--space-md)',
      animation: 'fadeStagger 260ms var(--ease-out-expo) both',
      animationDelay: `${index * 50}ms`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-sm)',
      }}>
        <div>
          <span style={{
            fontSize: 'var(--text-label)',
            color: 'var(--color-gold)',
            letterSpacing: '0.06em',
          }}>
            {entry.author}
          </span>
          {entry.location && (
            <span style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-muted)',
              marginLeft: 'var(--space-sm)',
            }}>
              {entry.location}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' · '}
            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={handleDeleteTap}
            aria-label={confirmDelete ? 'Confirm delete' : 'Delete memory'}
            style={{
              fontSize: confirmDelete ? 11 : 18,
              color: confirmDelete ? '#c0604a' : 'var(--color-muted)',
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: confirmDelete ? '0.04em' : 0,
              transition: `color var(--duration-fast) var(--ease-out-expo)`,
            }}
          >
            {confirmDelete ? 'Delete?' : '×'}
          </button>
        </div>
      </div>

      {entry.photos.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          overflowX: 'auto',
          marginBottom: 'var(--space-sm)',
          WebkitOverflowScrolling: 'touch' as never,
        }}>
          {entry.photos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={entry.note || 'Memory photo'}
              loading="lazy"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              style={{
                height: 140,
                borderRadius: 'var(--radius-sm)',
                flexShrink: 0,
                objectFit: 'cover',
                aspectRatio: '4/3',
              }}
            />
          ))}
        </div>
      )}

      {entry.note && (
        <p style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-cream)',
          lineHeight: 'var(--leading-normal)',
        }}>
          {entry.note}
        </p>
      )}
    </div>
  )
}
