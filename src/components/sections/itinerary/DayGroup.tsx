import { ItineraryDay, ItineraryItem } from '../../../db/schema'
import { ItineraryCard } from './ItineraryCard'
import { ItineraryCardEdit } from './ItineraryCardEdit'

interface Props {
  day: ItineraryDay
  isEditMode: boolean
  isPastDay: boolean
  currentTime: Date
  onUpdate: (item: ItineraryItem) => void
  onAdd: () => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

function isPastItem(date: string, time: string, now: Date): boolean {
  const [h, m] = time.split(':').map(Number)
  const itemDate = new Date(date)
  itemDate.setHours(h, m, 0, 0)
  return itemDate < now
}

export function DayGroup({ day, isEditMode, currentTime, onUpdate, onAdd, onMoveUp, onMoveDown }: Props) {
  return (
    <div style={{ marginBottom: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-stamp)',
          flexShrink: 0,
        }}>
          {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <div style={{ flex: 1, height: 1, background: 'var(--color-rule)' }} />
      </div>
      {day.items.length === 0 && !isEditMode && (
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-ink-faint)', padding: 'var(--space-md) 0' }}>
          Nothing planned yet
        </p>
      )}
      {day.items.map((item, idx) =>
        isEditMode
          ? <ItineraryCardEdit key={item.id} item={item} onUpdate={onUpdate}
              onMoveUp={idx > 0 ? () => onMoveUp(item.id) : undefined}
              onMoveDown={idx < day.items.length - 1 ? () => onMoveDown(item.id) : undefined} />
          : <ItineraryCard key={item.id} item={item} isPast={isPastItem(day.date, item.time, currentTime)} index={idx} />
      )}
      {isEditMode && (
        <button
          onClick={onAdd}
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            background: 'var(--color-paper-deep)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--color-rule)',
            color: 'var(--color-stamp)',
            fontSize: 'var(--text-body)',
            marginTop: 'var(--space-xs)',
            minHeight: 44,
          }}
        >
          + Add item
        </button>
      )}
    </div>
  )
}
