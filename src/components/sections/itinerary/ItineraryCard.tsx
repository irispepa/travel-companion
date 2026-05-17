import { useState } from 'react'
import { ItineraryItem } from '../../../db/schema'

interface Props {
  item: ItineraryItem
  isPast: boolean
  isEditing: boolean
  onEdit: () => void
  onClose: () => void
  onUpdate: (item: ItineraryItem) => void
  onDelete: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

const LinkGlyph = () => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 14a4 4 0 015.66 0l2 2a4 4 0 01-5.66 5.66l-1-1"/>
    <path d="M14 10a4 4 0 00-5.66 0l-2 2a4 4 0 005.66 5.66l1-1"/>
  </svg>
)

const inputBase: React.CSSProperties = {
  border: '1px solid var(--color-rule)',
  borderRadius: 6,
  padding: '4px 8px',
  background: 'var(--color-paper)',
  outline: 'none',
  color: 'var(--color-ink)',
  boxSizing: 'border-box',
  width: '100%',
}

export function ItineraryCard({ item, isPast, isEditing, onEdit, onClose, onUpdate, onDelete, onMoveUp, onMoveDown }: Props) {
  const [local, setLocal] = useState(item)

  const patch = (patch: Partial<ItineraryItem>) => {
    const updated = { ...local, ...patch }
    setLocal(updated)
    onUpdate(updated)
  }

  // Sync local when item changes externally (reorder, etc.)
  const [prevItem, setPrevItem] = useState(item)
  if (!isEditing && item !== prevItem) {
    setPrevItem(item)
    setLocal(item)
  }

  const { done, active } = local

  if (isEditing) {
    return (
      <div style={{
        background: 'var(--color-white)',
        border: '1.5px solid var(--color-stamp)',
        borderRadius: 10,
        padding: '10px 12px',
        boxShadow: '2px 3px 0 var(--color-ink)',
      }}>
        {/* Time + Name row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
          <input
            value={local.time}
            onChange={e => patch({ time: e.target.value })}
            placeholder="00:00"
            style={{
              ...inputBase,
              width: 50,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-stamp)',
              padding: '4px 6px',
            }}
          />
          <input
            value={local.name}
            onChange={e => patch({ name: e.target.value })}
            placeholder="What"
            style={{
              ...inputBase,
              flex: 1,
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 500,
            }}
            autoFocus
          />
        </div>

        {/* Location */}
        <input
          value={local.location}
          onChange={e => patch({ location: e.target.value })}
          placeholder="Where"
          style={{
            ...inputBase,
            marginTop: 0,
            marginBottom: 6,
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--color-ink-soft)',
          }}
        />

        {/* Notes / link */}
        <input
          value={local.notes}
          onChange={e => patch({ notes: e.target.value })}
          placeholder="Link / note (optional)"
          style={{
            ...inputBase,
            marginBottom: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--color-ink-blue)',
          }}
        />

        {/* Reorder buttons */}
        {(onMoveUp || onMoveDown) && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
            {onMoveUp && (
              <button onClick={onMoveUp} style={{ all: 'unset', cursor: 'pointer', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--color-rule)', color: 'var(--color-ink-soft)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>↑</button>
            )}
            {onMoveDown && (
              <button onClick={onMoveDown} style={{ all: 'unset', cursor: 'pointer', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--color-rule)', color: 'var(--color-ink-soft)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>↓</button>
            )}
          </div>
        )}

        {/* Action row */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => patch({ done: !done, active: false })}
            style={{
              all: 'unset', cursor: 'pointer', padding: '4px 10px', borderRadius: 999,
              border: `1px solid ${done ? 'var(--color-moss)' : 'var(--color-rule)'}`,
              background: done ? 'var(--color-moss)' : 'transparent',
              color: done ? 'var(--color-white)' : 'var(--color-ink-soft)',
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', fontWeight: 600,
            }}
          >
            {done ? '✓ DONE' : 'MARK DONE'}
          </button>
          <button
            onClick={() => patch({ active: !active, done: false })}
            style={{
              all: 'unset', cursor: 'pointer', padding: '4px 10px', borderRadius: 999,
              border: `1px solid ${active ? 'var(--color-stamp)' : 'var(--color-rule)'}`,
              background: active ? 'var(--color-stamp)' : 'transparent',
              color: active ? 'var(--color-white)' : 'var(--color-ink-soft)',
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', fontWeight: 600,
            }}
          >
            {active ? '· NOW' : 'NOW?'}
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={onDelete}
            style={{
              all: 'unset', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
              color: 'var(--color-stamp)',
            }}
          >
            DELETE
          </button>
          <button
            onClick={onClose}
            style={{
              all: 'unset', cursor: 'pointer', padding: '4px 10px', borderRadius: 999,
              background: 'var(--color-ink)', color: 'var(--color-paper)',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', fontWeight: 600,
            }}
          >
            DONE
          </button>
        </div>
      </div>
    )
  }

  // View mode — horizontal flex: drag handle | time | name+loc | link icon
  const hasLink = item.links.length > 0 || item.notes
  return (
    <div
      onClick={onEdit}
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        padding: '10px 12px',
        border: `1px solid ${item.active ? 'var(--color-ink)' : 'var(--color-rule)'}`,
        background: item.active ? 'var(--color-white)' : 'transparent',
        borderRadius: 10,
        boxShadow: item.active ? '2px 2px 0 var(--color-ink)' : 'none',
        opacity: isPast ? 0.55 : (item.done ? 0.55 : 1),
        cursor: 'pointer',
      }}
    >
      {/* Drag handle */}
      <div style={{
        color: 'var(--color-ink-faint)',
        paddingTop: 2,
        userSelect: 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        lineHeight: 1,
        flexShrink: 0,
      }}>
        ⋮⋮
      </div>

      {/* Time */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        color: item.active ? 'var(--color-stamp)' : 'var(--color-ink-soft)',
        minWidth: 38,
        paddingTop: 2,
        flexShrink: 0,
      }}>
        {item.time}
      </div>

      {/* Name + location */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--color-ink)',
          textDecoration: item.done ? 'line-through' : 'none',
          lineHeight: 1.3,
        }}>
          {item.name || <span style={{ color: 'var(--color-ink-faint)' }}>Unnamed item</span>}
        </div>
        {item.location && (
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--color-ink-soft)',
            marginTop: 1,
          }}>
            {item.location}
          </div>
        )}
      </div>

      {/* Link indicator */}
      {hasLink && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          color: 'var(--color-ink-blue)',
          fontWeight: 600,
          paddingTop: 3,
          flexShrink: 0,
        }}>
          <LinkGlyph />
        </div>
      )}
    </div>
  )
}
