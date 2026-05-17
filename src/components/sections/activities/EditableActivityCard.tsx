import { ActivityItem, ActivityTag } from '../../../db/schema'

const ALL_TAGS: { tag: ActivityTag; label: string }[] = [
  { tag: 'must-do', label: 'Must-do' },
  { tag: 'food', label: 'Food' },
  { tag: 'quick', label: 'Quick' },
  { tag: 'day-trip', label: 'Day trip' },
]

function PinIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"/>
      <circle cx="12" cy="8" r="2.4"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7"/>
    </svg>
  )
}

function StarFilled({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>
    </svg>
  )
}

function StarEmpty({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>
    </svg>
  )
}

interface Props {
  item: ActivityItem
  isEditing: boolean
  isDragging: boolean
  onEdit: () => void
  onClose: () => void
  onChange: (patch: Partial<ActivityItem>) => void
  onDelete: () => void
  onDragStart: () => void
  onDragEnd: () => void
  onDrop: () => void
}

export function EditableActivityCard({ item, isEditing, isDragging, onEdit, onClose, onChange, onDelete, onDragStart, onDragEnd, onDrop }: Props) {
  const { name, location, timeEstimate, cost, priority, notes, done, active, tags = [] } = item

  function toggleTag(tag: ActivityTag) {
    const next = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    onChange({ tags: next })
  }

  if (isEditing) {
    return (
      <div style={{
        background: 'var(--color-white)',
        border: '1.5px solid var(--color-stamp)',
        borderRadius: 12,
        padding: 14,
        boxShadow: '2px 3px 0 var(--color-ink)',
      }}>
        <input
          value={name}
          onChange={e => onChange({ name: e.target.value })}
          placeholder="Name"
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 500,
            border: '1px solid var(--color-rule)', borderRadius: 6,
            padding: '6px 10px', background: 'var(--color-paper)',
            outline: 'none', color: 'var(--color-ink)',
          }}
        />
        <input
          value={location}
          onChange={e => onChange({ location: e.target.value })}
          placeholder="Location"
          style={{
            width: '100%', boxSizing: 'border-box', marginTop: 6,
            fontFamily: 'var(--font-sans)', fontSize: 12,
            border: '1px solid var(--color-rule)', borderRadius: 6,
            padding: '6px 10px', background: 'var(--color-paper)',
            outline: 'none', color: 'var(--color-ink-soft)',
          }}
        />
        <textarea
          value={notes || ''}
          onChange={e => onChange({ notes: e.target.value })}
          placeholder="Notes"
          rows={2}
          style={{
            width: '100%', boxSizing: 'border-box', marginTop: 6,
            fontFamily: 'var(--font-sans)', fontSize: 13,
            border: '1px solid var(--color-rule)', borderRadius: 6,
            padding: '6px 10px', background: 'var(--color-paper)',
            outline: 'none', color: 'var(--color-ink)', resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <input
            value={timeEstimate}
            onChange={e => onChange({ timeEstimate: e.target.value })}
            placeholder="Time"
            style={{
              flex: 1, boxSizing: 'border-box',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              border: '1px solid var(--color-rule)', borderRadius: 6,
              padding: '6px 10px', background: 'var(--color-paper)',
              outline: 'none', color: 'var(--color-ink)',
            }}
          />
          <input
            value={cost}
            onChange={e => onChange({ cost: e.target.value })}
            placeholder="Cost"
            style={{
              flex: 1, boxSizing: 'border-box',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              border: '1px solid var(--color-rule)', borderRadius: 6,
              padding: '6px 10px', background: 'var(--color-paper)',
              outline: 'none', color: 'var(--color-ink)',
            }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginTop: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--color-ink-soft)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Tags</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ALL_TAGS.map(({ tag, label }) => {
              const active = tags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    all: 'unset', cursor: 'pointer',
                    padding: '4px 10px', borderRadius: 999,
                    border: `1px solid ${active ? 'var(--color-ink)' : 'var(--color-rule)'}`,
                    background: active ? 'var(--color-ink)' : 'transparent',
                    color: active ? 'var(--color-paper)' : 'var(--color-ink-soft)',
                    fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500,
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Priority stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--color-ink-soft)', marginRight: 6, textTransform: 'uppercase' }}>Priority</span>
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              onClick={() => onChange({ priority: n })}
              style={{ all: 'unset', cursor: 'pointer', padding: 2, color: n <= priority ? 'var(--color-mustard)' : 'var(--color-rule)' }}
            >
              {n <= priority ? <StarFilled size={16}/> : <StarEmpty size={16}/>}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, alignItems: 'center' }}>
          <button
            onClick={() => onChange({ done: !done })}
            style={{
              all: 'unset', cursor: 'pointer',
              padding: '4px 10px', borderRadius: 999,
              border: `1px solid ${done ? 'var(--color-moss)' : 'var(--color-rule)'}`,
              background: done ? 'var(--color-moss)' : 'transparent',
              color: done ? '#fbf7ee' : 'var(--color-ink-soft)',
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {done ? '✓ Done' : 'Mark Done'}
          </button>
          <div style={{ flex: 1 }}/>
          <button
            onClick={onDelete}
            style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--color-stamp)' }}
          >
            DELETE
          </button>
          <button
            onClick={onClose}
            style={{
              all: 'unset', cursor: 'pointer',
              padding: '4px 12px', borderRadius: 999,
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

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={e => e.preventDefault()}
      onDrop={onDrop}
      onClick={onEdit}
      style={{
        background: active ? 'var(--color-white)' : 'var(--color-paper-deep)',
        border: `1px solid ${active ? 'var(--color-ink)' : 'var(--color-rule)'}`,
        borderRadius: 12,
        padding: '14px 14px 12px',
        boxShadow: active ? '2px 3px 0 var(--color-ink)' : 'none',
        opacity: isDragging ? 0.4 : (done ? 0.55 : 1),
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Name + stars */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 500,
            letterSpacing: '-0.01em', lineHeight: 1.15,
            color: 'var(--color-ink)',
          }}>
            {name}
          </div>
          {location && (
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-ink-soft)',
              marginTop: 3, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <PinIcon/> {location}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 1, color: 'var(--color-mustard)', flexShrink: 0 }}>
          {[1,2,3,4,5].map(n => (
            n <= priority
              ? <StarFilled key={n}/>
              : <span key={n} style={{ color: 'var(--color-rule)' }}><StarEmpty/></span>
          ))}
        </div>
      </div>

      {/* Note */}
      {notes && (
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-ink)',
          marginTop: 8, lineHeight: 1.45,
        }}>
          {notes}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--color-ink-soft)',
              border: '1px solid var(--color-rule)', borderRadius: 999,
              padding: '2px 7px',
            }}>
              {ALL_TAGS.find(t => t.tag === tag)?.label ?? tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: time · cost · status */}
      <div style={{
        display: 'flex', gap: 16, marginTop: 10, paddingTop: 10,
        borderTop: '1px dashed var(--color-rule)',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
        color: 'var(--color-ink-soft)', textTransform: 'uppercase',
        alignItems: 'center',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ClockIcon/> {timeEstimate}
        </span>
        <span>{cost}</span>
        {done && (
          <span style={{ marginLeft: 'auto', color: 'var(--color-moss)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckIcon/> DONE
          </span>
        )}
        {active && !done && (
          <span style={{ marginLeft: 'auto', color: 'var(--color-stamp)' }}>· TODAY</span>
        )}
      </div>
    </div>
  )
}
