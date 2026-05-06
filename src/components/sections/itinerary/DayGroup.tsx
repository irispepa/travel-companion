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
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-sm)' }}>
        {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      {day.items.map((item, idx) =>
        isEditMode
          ? <ItineraryCardEdit key={item.id} item={item} onUpdate={onUpdate}
              onMoveUp={idx > 0 ? () => onMoveUp(item.id) : undefined}
              onMoveDown={idx < day.items.length - 1 ? () => onMoveDown(item.id) : undefined} />
          : <ItineraryCard key={item.id} item={item} isPast={isPastItem(day.date, item.time, currentTime)} />
      )}
      {isEditMode && (
        <button onClick={onAdd} style={{ width: '100%', padding: 'var(--space-sm)', background: 'var(--color-bg-card-alt)', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold)', fontSize: 13, marginTop: 'var(--space-xs)' }}>
          + Add item
        </button>
      )}
    </div>
  )
}
