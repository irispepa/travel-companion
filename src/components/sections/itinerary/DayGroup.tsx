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
      <div style={{
        fontSize: 'var(--text-caption)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--color-gold)',
        marginBottom: 'var(--space-sm)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      {day.items.length === 0 && !isEditMode && (
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-muted)', padding: 'var(--space-md) 0' }}>
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
            background: 'var(--color-bg-card-alt)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-gold)',
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
