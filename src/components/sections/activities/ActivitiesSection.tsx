import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CityViewId, ActivityTag } from '../../../db/schema'
import { getCityView } from '../../../config/cities'
import { useActivities } from '../../../hooks/useActivities'
import { CalculatorOverlay } from '../../calculator/CalculatorOverlay'
import { EditableActivityCard } from './EditableActivityCard'

const FILTER_CHIPS: { label: string; tag: ActivityTag | null }[] = [
  { label: 'All', tag: null },
  { label: 'Must-do', tag: 'must-do' },
  { label: 'Food', tag: 'food' },
  { label: 'Quick', tag: 'quick' },
  { label: 'Day trip', tag: 'day-trip' },
]

type SortKey = 'priority' | 'cost' | 'timeEstimate'
export function sortActivities(items: import('../../../db/schema').ActivityItem[], key: SortKey) {
  return [...items].sort((a, b) => {
    if (key === 'priority') return b.priority - a.priority
    return String(a[key]).localeCompare(String(b[key]))
  })
}

// Inline SVG glyphs matching the design system
function Glyph({ name, size = 16, color = 'currentColor', strokeWidth = 1.6 }: {
  name: string; size?: number; color?: string; strokeWidth?: number
}) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'arrow-left') return <svg {...p}><path d="M14 6l-6 6 6 6"/></svg>
  if (name === 'sliders') return <svg {...p}><path d="M4 6h12M4 12h8M4 18h14"/><circle cx="18" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="20" cy="18" r="2"/></svg>
  if (name === 'plus') return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>
  return null
}

export function ActivitiesSection() {
  const { cityViewId } = useParams<{ cityViewId: CityViewId }>()
  const config = getCityView(cityViewId!)
  const navigate = useNavigate()
  const { items, loading, updateItem, addItem, deleteItem, reorderItems } = useActivities(config.cityId)
  const [activeTag, setActiveTag] = useState<ActivityTag | null>(null)

  const visibleItems = activeTag ? items.filter(a => a.tags?.includes(activeTag)) : items
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [showCalc, setShowCalc] = useState(false)

  function handleAdd() {
    const id = crypto.randomUUID()
    addItem({ id, name: 'New activity', location: '', timeEstimate: '1h', cost: 'Free', priority: 3, notes: '', link: '' })
    setEditingId(id)
  }

  function handleDrop(toId: string) {
    if (!draggingId || draggingId === toId) return
    const fromIdx = items.findIndex(a => a.id === draggingId)
    const toIdx = items.findIndex(a => a.id === toId)
    if (fromIdx < 0 || toIdx < 0) return
    const next = [...items]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    reorderItems(next)
    setDraggingId(null)
  }

  return (
    <div style={{ background: 'var(--color-paper)', minHeight: '100dvh', color: 'var(--color-ink)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '10px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            all: 'unset', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
            color: 'var(--color-ink-soft)', minHeight: 44,
          }}
        >
          <Glyph name="arrow-left" size={14} color="var(--color-ink-soft)"/>
          {config.label.toUpperCase()}
        </button>
        <button
          onClick={() => setShowCalc(true)}
          aria-label="Calculator"
          style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
            color: 'var(--color-ink-soft)', minHeight: 44,
          }}
        >
          CALC
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '6px 22px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
          color: 'var(--color-stamp)', fontWeight: 600, textTransform: 'uppercase',
        }}>
          THE LIST · {visibleItems.length} ITEMS
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 500,
          margin: '4px 0 0', letterSpacing: '-0.02em', color: 'var(--color-ink)',
        }}>
          What to do.
        </h1>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-ink-soft)',
          marginTop: 4, fontStyle: 'italic',
        }}>
          Cherry-picked. Tap to edit, drag to reorder.
        </div>
      </div>

      {/* Filter chips + sort */}
      <div style={{
        padding: '16px 18px 4px',
        display: 'flex', gap: 6, alignItems: 'center',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch' as unknown as undefined,
        scrollbarWidth: 'none' as unknown as undefined,
      }}>
        {FILTER_CHIPS.map(({ label, tag }) => (
          <button
            key={label}
            onClick={() => setActiveTag(tag)}
            style={{
              all: 'unset', cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 999,
              border: `1px solid var(--color-ink)`,
              background: activeTag === tag ? 'var(--color-ink)' : 'transparent',
              color: activeTag === tag ? 'var(--color-paper)' : 'var(--color-ink)',
              fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {label}
          </button>
        ))}
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em',
          color: 'var(--color-ink-soft)', paddingRight: 4, flexShrink: 0,
        }}>
          <Glyph name="sliders" size={14} color="var(--color-ink-soft)"/> SORT
        </div>
      </div>

      {/* Activity list */}
      <div style={{ padding: '12px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && (
          <div style={{ color: 'var(--color-ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', padding: '20px 0', textAlign: 'center' }}>
            LOADING…
          </div>
        )}
        {!loading && visibleItems.map(item => (
          <EditableActivityCard
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            isDragging={draggingId === item.id}
            onEdit={() => setEditingId(item.id)}
            onClose={() => setEditingId(null)}
            onChange={patch => updateItem(item.id, patch)}
            onDelete={() => { deleteItem(item.id); setEditingId(null) }}
            onDragStart={() => setDraggingId(item.id)}
            onDragEnd={() => setDraggingId(null)}
            onDrop={() => handleDrop(item.id)}
          />
        ))}

        <button
          onClick={handleAdd}
          style={{
            all: 'unset', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '12px',
            border: `1px dashed var(--color-rule)`,
            borderRadius: 12,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
            color: 'var(--color-ink-soft)',
            minHeight: 44,
          }}
        >
          <Glyph name="plus" size={13} color="var(--color-ink-soft)"/> ADD ACTIVITY
        </button>
      </div>

      {showCalc && <CalculatorOverlay cityViewId={cityViewId!} onClose={() => setShowCalc(false)} />}
    </div>
  )
}
